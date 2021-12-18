import React, { Component } from 'react';
//import { useState } from 'react';
import './App.css';
import TaskForm from './component/TaskForm';
import Control from './component/Control';
import TaskList from './component/TaskList';

// caif đặt thư viện thirty-party:  npm install lodash --save// import _ from 'lodash'
import {findIndex, filter} from 'lodash'


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],// ds table
            isDisplayForm: false,// form trais
            taskEditing: null,
            filter: {
                name: '',
                status: -1
            },
            keyword: '',
            sortBy: 'name',
            sortValue: 1
        }
    }
    componentDidMount() { // luu dl khi F5
        if (localStorage && localStorage.getItem('tasks')) {
            var tasks = JSON.parse(localStorage.getItem('tasks')); //parse: chuyeenr sang dang object
            this.setState({
                tasks: tasks
            });
        }
    }
    //random id:
    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    generateID = () => {
        return this.s4() + this.s4() + '-' + this.s4() + this.s4() + '-' + this.s4() + this.s4() + '-' + this.s4() + this.s4() + '-' + this.s4();
    }
    //const [name, setName] = useState([])


    // onGenerateData = () => {
    //     var tasks = [
    //         {
    //             id: this.generateID(),
    //             name: 'Van',
    //             status: true
    //         },
    //         {
    //             id: this.generateID(),
    //             name: 'Van2',
    //             status: true
    //         },
    //         {
    //             id: this.generateID(),
    //             name: 'Van3',
    //             status: false
    //         }
    //     ]

    //     this.setState({
    //         tasks: tasks
    //     });
    //     //Luu dlieu vao localStorage
    //     localStorage.setItem('tasks', JSON.stringify(tasks));
    // }
    onToggleForm = () => {// theem task
        if (this.state.isDisplayForm && this.state.taskEditing !== null) {
            this.setState({
                isDisplayForm: true,
                taskEditing: null
            });
        } else {
            this.setState({
                isDisplayForm: !this.state.isDisplayForm,
                taskEditing: null
            });
        }

    }
    onCloseForm = () => {
        this.setState({
            isDisplayForm: false
        });
    }
    onShowForm = () => {
        this.setState({
            isDisplayForm: true
        });
    }
    // nhận state từ form truyền về
    onSubmit = (data) => {
        // console.log(data);
        var { tasks } = this.state;
        if (data.id === '') {
            data.id = this.generateID();
            tasks.push(data);  // push vao mang
        } else {
            //edit
            var index = this.findIndex(data.id);
            tasks[index] = data;
        }

        this.setState({
            tasks: tasks,
            taskEditing: null
        });
        // luu vao localstorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    onUpdateStatus = (id) => {
        //console.log(id);
        var { tasks } = this.state;
        // var index = this.findIndex(id);
        var index = findIndex(tasks, (task) => {
            return task.id === id;
        });
        if (index !== -1) {
            tasks[index].status = !tasks[index].status;
            this.setState({
                tasks: tasks
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
    findIndex = (id) => {
        var { tasks } = this.state;
        var result = -1;
        tasks.forEach((task, index) => {
            if (task.id === id) {
                result = index;
            }
        });
        return result;
    }
    onDelete = (id) => {

        var { tasks } = this.state;
        var index = this.findIndex(id);
        console.log(index);
        if (index !== -1) {// tim thay
            tasks.splice(index, 1);// xoa 1 phan tu
            this.setState({
                tasks: tasks
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
        this.onCloseForm();
    }

    onUpdate = (id) => {
        var { tasks } = this.state;
        var index = this.findIndex(id);
        var taskEditing = tasks[index];
        // console.log(taskEditing);
        this.setState({
            taskEditing: taskEditing
        });
        this.onShowForm();
    }
    onFilter = (filterName, filterStatus) => {

        filterStatus = parseInt(filterStatus, 10);
        this.setState({
            filter: {
                name: filterName.toLowerCase(),
                status: filterStatus
            }
        });

    }
    onSearch = (keyword) => {
        this.setState({
            keyword: keyword
        });
    }
    onSort = (sortBy, sortValue) => {

        this.setState({
            sortBy: sortBy,
            sortValue: sortValue
        })

    }
    render() {
        var {
            tasks,
            isDisplayForm,
            taskEditing,
            filter, keyword,
            sortBy,
            sortValue
        } = this.state  //var tasks=this.state.tasks
        if (filter) {
            if (filter.name) {
                tasks = tasks.filter((task) => {
                    return task.name.toLowerCase().indexOf(filter.name) !== -1;
                });
            }

            tasks = tasks.filter((task) => {
                if (filter.status === -1) {
                    return task;

                } else {
                    return task.status === (filter.status === 1 ? true : false);
                }

            });

        }
        // search
        if (keyword) {
            tasks = tasks.filter((task) => {
                return task.name.toLowerCase().indexOf(keyword) !== -1;
            });
        }

        var elmTaskForm = isDisplayForm
            ? <TaskForm
                onSubmit={this.onSubmit}
                onCloseForm={this.onCloseForm}
                task={taskEditing}

            />
            : '';
        // sort by name or value
        if (sortBy === 'name') {
            tasks.sort((a, b) => {
                if (a.name > b.name) return sortValue
                else if (a.name < b.name) return -sortValue
                else return 0;
            });
        } else {
            tasks.sort((a, b) => {
                if (a.status > b.status) return -sortValue
                else if (a.status < b.status) return sortValue
                else return 0;
            });
        }
        return (
            <div className="container">
                <div className="text-center">
                    <h1>Quản Lý Công Việc</h1>
                    <hr />
                </div>
                <div className="row">
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        {/* <TaskForm /> */}
                        {elmTaskForm}
                    </div>
                    <div className={isDisplayForm ? "col-xs-8 col-sm-8 col-md-8 col-lg-8" : "col-xs-12 col-sm-12 col-md-12 col-lg-12"}>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.onToggleForm}
                        >
                            <span className="fa fa-plus mr-5"></span>Thêm Công Việc
                        </button>

                        <div className="row mt-15">
                            <Control
                                onSearch={this.onSearch}
                                onSort={this.onSort}
                                sortBy={sortBy}
                                sortValue={sortValue}
                            />
                        </div>
                        <div className="row mt-15">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <TaskList
                                    tasks={tasks}
                                    onUpdateStatus={this.onUpdateStatus}
                                    onDelete={this.onDelete}
                                    onUpdate={this.onUpdate}
                                    onFilter={this.onFilter}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default App;
