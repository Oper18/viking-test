from aiohttp import web

from tortoise.expressions import Q

from models.models import User, Employee

from tortoise.expressions import Q

from v1.response_models import Error4xxResponse

from .request_models import QueryRequest, ManageEmployeeRequest
from .response_models import EmployeeResponse, EmployeeListResponse


card_routes = web.RouteTableDef()


@card_routes.view("/api/v1/employers")
class EmployersView(web.View):
    async def get(self):
        query_data = QueryRequest.parse_obj(self.request.query)
        users = []
        if query_data.search:
            users = await User.filter(
                Q(first_name=query_data.search) |
                Q(last_name=query_data.search) |
                Q(patronymic=query_data.search)
            )
        if users:
            employees = Employee.filter(employee__id__in=[u.id for u in users])
        else:
            employees = Employee.all()
        employees_count = await employees.count()
        employees = await employees.limit(
            query_data.limit
        ).offset(
            query_data.offset
        ).order_by(
            "-created_at"
        ).prefetch_related("employee", "chief")
        res = list()
        for e in employees:
            r = await e.as_dict()
            r["employee"] = await e.employee
            r["employee"] = await r["employee"].as_dict()
            if e.chief_id:
                r["chief"] = await e.chief
                r["chief"] = await r["chief"]
            res.append(
                EmployeeResponse.parse_obj(r).dict()
            )
        return web.json_response(
            EmployeeListResponse(
                count=employees_count,
                employees=res
            ).dict()
        )

    async def post(self):
        request_data = await self.request.json()
        request_data = ManageEmployeeRequest.parse_obj(request_data)
        if request_data.first_name is None \
                or request_data.last_name is None \
                or request_data.patronymic is None:
            return web.json_response(
                Error4xxResponse(
                    message="first_name, last_name, patronymic required"
                ).dict(),
                status=400,
            )
        request_data_dict = request_data.dict()
        request_data_dict.pop("id")
        user = await User.create(**request_data_dict)
        request_data_dict["employee"] = user
        if request_data.chief:
            request_data_dict["chief"] = await User.get(id=request_data.chief)
        employee = await Employee.create(**request_data_dict)
        res = await employee.as_dict()
        res["employee"] = await user.as_dict()
        if employee.chief_id:
            chief = await employee.chief
            res["chief"] = await chief.as_dict()
        return web.json_response(
            EmployeeResponse.parse_obj(res).dict()
        )

    async def put(self):
        request_data = await self.request.json()
        request_data = ManageEmployeeRequest.parse_obj(request_data)
        if request_data.id is None:
            return web.json_response(
                Error4xxResponse(
                    message="user id required"
                ).dict(),
                status=400,
            )
        employee = await Employee.get(id=request_data.id)
        user = await employee.employee
        for f in request_data:
            if f[0] == "id":
                continue
            if f[0] in ['employee', 'chief']:
                f = (f[0] + '_id', f[1])
            if f[1] and hasattr(user, f[0]):
                user.__setattr__(f[0], f[1])
            elif f[1] and hasattr(employee, f[0]):
                employee.__setattr__(f[0], f[1])

        await user.save()
        await employee.save()

        res = await employee.as_dict()
        res["employee"] = await user.as_dict()
        if employee.chief_id:
            chief = await employee.chief
            res["chief"] = await chief.as_dict()

        return web.json_response(
            EmployeeResponse.parse_obj(res).dict()
        )

