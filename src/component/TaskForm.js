import { Component } from "react";

class TaskForm extends Component {

    // dùng state để luu input
    constructor(props) {
        super(props);
        this.state = {
            id:'',
            name: '',
            status: false
        }
    }
    onCloseForm = () => {
        this.props.onCloseForm();
    }

    onChange=(event)=>{
        var target= event.target;
        var name= target.name;
        var value= target.value;
        if(name==='status'){
            value=target.value==='true'? true: false;
        }
        this.setState({
            [event.target.name]: value
        });
       
    }

    onSubmit=(event)=>{
        event.preventDefault();// ko load lai trang khi cick vao lưu lai
        // console.log(this.state);
        // truyền state ra ngoài
      //  this.props.onSubmit(this.state.name, this.state.status==='true'?true: false);
      this.props.onSubmit(this.state);
      // sau khi save thì cancel và close form
      this.onClear();
      this.onCloseForm();
    }

    onClear=()=>{
        this.setState({
            name:'',
            status:false
        });
    }

    componentDidMount(){
        if(this.props.task){
            this.setState({  // lay dl vao form
                id: this.props.task.id,
                name: this.props.task.name,
                status: this.props.task.status
            });
            console.log(this.state);
        }
    }
    // lay dlieu thi click sua nhieu lan
    static getDerivedStateFromProps(nextProps){
        if(nextProps && nextProps.task){
          return {
            id : nextProps.task.id,
            name : nextProps.task.name,
            status : nextProps.task.status,
           };
       }
       else if(!nextProps.task) {
           return {
            id:'',
            name: '',
            status: false
       }};
     }

    render() {
        var {id}= this.state;
        return (
            <div className="panel panel-warning">
                <div className="panel-heading">
                    <h3 className="panel-title">
                    {id!==''?'Cập nhật công việc': 'Thêm Công Việc'}
                        <span
                            className="fa fa-times-circle text-right"
                            onClick={this.onCloseForm}
                        >
                        </span>
                    </h3>
                </div>
                <div className="panel-body">
                    <form onSubmit ={this.onSubmit}>
                        <div className="form-group">
                            <label>Tên :</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={this.state.name}
                                onChange={this.onChange}
                            />
                        </div>
                        <label>Trạng Thái :</label>
                        <select
                            className="form-control"
                           
                            name="status"
                            value={this.state.status}
                            onChange={this.onChange}
                        >
                            <option value={true}>Kích Hoạt</option>
                            <option value={false}>Ẩn</option>
                        </select>
                        <br />
                        <div className="text-center">
                            <button type="submit" className="btn btn-warning">Lưu lại</button>&nbsp;
                            <button 
                                type="button" 
                                className="btn btn-danger"
                                onClick={this.onClear}
                            >
                                Hủy Bỏ</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

}

export default TaskForm;
