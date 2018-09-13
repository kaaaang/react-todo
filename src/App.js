import React, { Component } from 'react';
import * as uuid from 'uuid/v1';
import TodoItem from './components/TodoItem'
import styled from 'styled-components';

const App = styled.section`
  padding: 20px 36px;
`;

const Title = styled.h1`
  text-align: center;
`;

const AddForm = styled.form`
  input{
    margin: 0;
    padding: 8px 0 8px 4px;
    width: calc(100% - 60px);
    border: 1px solid #cccccc;
    box-sizing: border-box;
  }

  button{
    margin: 0;
    padding: 8px 0;
    widtH: 60px;
    border: 1px solid #cccccc;
    background: #ffffff;
    box-sizing: border-box;
  }
`;

const TodoList = styled.ul`
  padding: 0;
  list-style: none;

  li{
    padding: 10px 0;

    &+li{
      border-top: 1px solid #cccccc;
    }
  }
`;

export default class extends Component {
  constructor(props) {
    super(props);

    this.deleteTodo = this.deleteTodo.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.editTodo = this.editTodo.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onChangeDisplayFilter = this.onChangeDisplayFilter.bind(this);
    this.getFromLocal = this.getFromLocal.bind(this);

    const todoList = this.getFromLocal();

    this.state = {
      todoList: todoList || [],
      inputText: '',
      isDisplayOnlyComplete: false
    };
  }

  render() {
    const TodoContent = () => !!this.state.todoList.length ?
                          (<TodoList>
                          {
                            this.state.todoList.filter(todo => {
                              if (this.state.isDisplayOnlyComplete) {
                                return todo.isSuccess;
                              }

                              return true;
                            }).map((todo, index) => {
                              return (
                                <TodoItem content={todo.content} 
                                          onComplete={this.onClickCompleteButton} 
                                          onDelete={this.deleteTodo}
                                          onEdit={this.editTodo}
                                          key={`task-${todo.id}`}
                                          id={todo.id}/>
                            )})
                          }
                          </TodoList>)
                          : <p>할 일이 없습니다. 할 일을 추가해주세요.</p>;
    const CompleteTaskFilter = () => (<label style={{ display: 'block', margin: '10px 0'}}>
                                        <input type="checkbox" onChange={this.onChangeDisplayFilter} checked={this.state.isDisplayOnlyComplete}/>
                                        완료된 태스크만 보기
                                      </label>);

    return (
      <App>
        <Title>😀 Todo List 😀</Title>
        <AddForm onSubmit={this.addTodo}>
          <input value={this.state.inputText} onChange={this.onChangeInput} placeholder="새로운 할 일을 입력해주세요."/>
          <button type="submit"> ADD </button>
        </AddForm>

        <CompleteTaskFilter />
        <TodoContent />
      </App>
    );
  }

  onChangeDisplayFilter(event) {
    this.setState({
      isDisplayOnlyComplete: !this.state.isDisplayOnlyComplete
    })
  }

  onChangeInput(event) {
    this.setState({ inputText: event.target.value });
  }

  async addTodo(event) {
    event.preventDefault();

    if (!this.state.inputText) return;

    await this.setState({
      todoList: [...this.state.todoList, { content: this.state.inputText, id: uuid() }],
      inputText: ''
    });

    this.saveInLocal(this.state.todoList);
  }

  deleteTodo(taskId) {
    const { todoList } = this.state;
    const deletedTodoIndex = todoList.findIndex(todo => todo.id === taskId);
    const [deleteTodo] = todoList.splice(deletedTodoIndex, 1);

    alert(`"${deleteTodo.content}"가 삭제되었습니다.`);

    this.setState({ todoList: [...todoList] });
  }

  completeTodo(taskId) {
    const { todoList } = this.state;
    const deletedTodoIndex = todoList.findIndex(todo => todo.id === taskId);
    const [deleteTodo] = todoList.splice(deletedTodoIndex, 1);
    
    this.setState({

    })
  }

  editTodo(taskId, task) {
    const { todoList } = this.state;
    const editTodoIndex = todoList.findIndex(todo => todo.id === taskId);

    todoList.splice(editTodoIndex, 1, task);

    this.setState({ todoList: [...todoList] });
  }

  saveInLocal(todoList) {
    localStorage.setItem('todoList', todoList.map(todo => JSON.stringify(todo)).join('||split-point||'));
  }

  getFromLocal() {
    const todoListString = localStorage.getItem('todoList') || '';
    const todoList = todoListString.split('||split-point||').map(todo => {
      if (!!todo) return JSON.parse(todo)
    });

    return !!todoListString ? todoList : null;
  }
}
