import datetime


class BaseModel(object):
    _exclude = ()

    async def as_dict(self):
        res = {}
        for c in self.__dict__:
            if c[0] == "_" or c in self._exclude:
                continue
            if isinstance(getattr(self, c), datetime.datetime) or isinstance(getattr(self, c), datetime.date):
                res[c] = getattr(self, c).isoformat()
            else:
                res[c] = getattr(self, c)
        return res

