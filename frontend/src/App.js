import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 10,
      offset: 0,
      employees: [],
      employees_count: 0,
      new_employee: false,
      new_employee_data: {},
    }
  }

  componentDidMount() {
    this.getEmployees(this.state.limit, this.state.offset).then(json => {
        if (!json) {
            return
        }
        this.setState({
          employees: json.employees,
          employees_count: json.employees_count,
        })
      })
  }

  manageEmployee(data, method='POST') {
    var uri = new URL(process.env.REACT_APP_BACKEND_URI + '/api/v1/employers')
    fetch(uri.href, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => {
      if (res.status !== 200) {
          throw new Error('Something went wrong');
      }
      return res.json()
    })
    .then(json => {
      if (!json) {
          return
      }
      var employees = this.state.employees
      var employees_count = this.state.employees_count
      if (method === 'POST') {
        employees.splice(0, 0, json)
        employees_count++
      }
      else if (method === 'PUT') {
        employees.map(
          (employee) => {
            if (parseInt(employee.id) === parseInt(json.id)) {
              return json
            }
            else {
              return employee
            }
          }
        )
      }
      this.setState(
        {
          employees_count: employees_count,
          employees: employees,
          new_employee: false,
        }
      )
    })
  }
  
  getEmployees(limit, offset, search='') {
    var uri = new URL(process.env.REACT_APP_BACKEND_URI + '/api/v1/employers')
    uri.searchParams.set("limit", limit)
    uri.searchParams.set("offset", offset)
    if (search !== '') {
      uri.searchParams.set("search", search)
    }
    return fetch(uri.href, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
          if (res.status !== 200) {
              throw new Error('Something went wrong');
          }
          return res.json()
      })
      
  }

  renderEmployees() {
    return this.state.employees.map((employee) => {
      return (
        <div>
          <EmployeeInfo
            employee={employee}
            new_employee={false}
            manageEmployee={this.manageEmployee.bind(this)}
            getEmployees={this.getEmployees.bind(this)}
          />
        </div>
      )
    })
  }

  render() {
    return (
      <div className="App">
        <div
          style={
            {
              display: 'flex',
            }
          }
        >
          <div
            style={
              {
                width: '10%',
              }
            }
          >
            Name
          </div>
          <div
            style={
              {
                width: '10%',
              }
            }
          >
            Position
          </div>
          <div
            style={
              {
                width: '10%',
              }
            }
          >
            Salary
          </div>
          <div
            style={
              {
                width: '10%',
              }
            }
          >
            Start working date
          </div>
          <div
            style={
              {
                width: '10%',
              }
            }
          >
            Chief
          </div>
        </div>
        {this.state.new_employee
          ? <EmployeeInfo
              employee={{}}
              new_employee={true}
              manageEmployee={this.manageEmployee.bind(this)}
              getEmployees={this.getEmployees.bind(this)}
            />
            : <div
              style={
                {
                  marginTop: '0.25rem',
                  marginBottom: '0.25rem',
                  width: 'fit-content',
                  marginLeft: '2rem',
                }
              }
                onClick={
                  () => {this.setState({new_employee: true})}
                }
              >
                Add employee
              </div>
        }
        {this.renderEmployees()}
      </div>
    )
  }
}

class EmployeeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee: {id: (!this.new_employee) ? this.props.employee.id : null},
    }
  }

  updateEmployeeData(employee) {
    this.setState({employee: employee})
  }

  render() {
    return (
      <div
        style={
          {
            display: 'flex',
            marginTop: '0.25rem',
            marginBottom: '0.25rem',
          }
        }
      >
        <div>
          <div>
            <input
              onChange={
                (e) => {
                  var employee = this.state.employee
                  employee.first_name = e.target.value
                  this.setState({employee: employee})
                }
              }
              defaultValue={(this.props.employee.employee) ? this.props.employee.employee.first_name : ''}
            />
          </div>
          <div>
            <input
              onChange={
                (e) => {
                  var employee = this.state.employee
                  employee.last_name = e.target.value
                  this.setState({employee: employee})
                }
              }
              defaultValue={(this.props.employee.employee) ? this.props.employee.employee.last_name : ''}
            />
          </div>
          <div>
            <input
              onChange={
                (e) => {
                  var employee = this.state.employee
                  employee.patronymic = e.target.value
                  this.setState({employee: employee})
                }
              }
              defaultValue={(this.props.employee.employee) ? this.props.employee.employee.patronymic : ''}
            />
          </div>
        </div>
        <div>
          <div>
            <input
              onChange={
                (e) => {
                  var employee = this.state.employee
                  employee.position = e.target.value
                  this.setState({employee: employee})
                }
              }
              defaultValue={this.props.employee.position}
            />
          </div>
        </div>
        <div>
          <div>
            <input
              onChange={
                (e) => {
                  var employee = this.state.employee
                  employee.salary = parseFloat(e.target.value)
                  this.setState({employee: employee})
                }
              }
              type='number'
              defaultValue={this.props.employee.salary}
            />
          </div>
        </div>
        <div>
          <div>
            <input
              onChange={
                (e) => {
                  var employee = this.state.employee
                  employee.work_date_start = e.target.value
                  this.setState({employee: employee})
                }
              }
              type='date'
              defaultValue={(this.props.employee.work_date_start) ? this.props.employee.work_date_start.split('T')[0] : ''}
            />
          </div>
        </div>
        <div>
          <ChiefSelect 
            employee={this.state.employee}
            updateEmployeeData={this.updateEmployeeData.bind(this)}
            new_employee={this.props.new_employee}
            getEmployees={this.props.getEmployees}
            chief={this.props.employee.chief}
          />
        </div>
        <div
          onClick={
            () => {
              this.props.manageEmployee(
                this.state.employee, (this.props.new_employee) ? 'POST' : 'PUT'
              )
            }
          }
        >
          Save
        </div>
      </div>
    )
  }
}

class ChiefSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      chiefs: [],
      chief: this.props.chief,
    }
  }

  renderChiefsList() {
    return this.state.chiefs.map((chief) => {
      return (
        <div
          onClick={
            (e) => {
              var employee = this.props.employee
              employee.chief = chief.id
              this.props.updateEmployeeData(employee)
              var elem_search = document.getElementById('chief_search')
              elem_search.value = chief.employee.first_name + ' ' + chief.employee.last_name
            }
          }
        >
          {chief.employee.first_name} {chief.employee.last_name}
        </div>
      )
    })
  }

  render() {
    var chief = ''
    if (this.state.chief) {
      chief = this.state.chief.first_name + ' ' + this.state.chief.last_name
    }
    return (
      <div>
        <div>
          <div>
            <input
              id='chief_search'
              defaultValue={chief}
              onChange={
                (e) => {
                  this.setState({search: e.target.value})
              }
              }
            />
          </div>
          <div
            onClick={
              () => {
                this.props.getEmployees(5, 0, this.state.search).then(json => {
                  if (!json) {
                      return
                  }
                  this.setState({
                    chiefs: json.employees,
                  })
                })
              }
            }
          >
            Search
          </div>
        </div>
        <div>
          {this.renderChiefsList()}
        </div>
      </div>
    )
  }
}

export default App;
