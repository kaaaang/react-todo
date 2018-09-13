import React, { Component } from 'react';
import * as uuid from 'uuid/v1';

export default class extends Component{
  constructor(props) {
    super(props);

    this.toggleState = this.toggleState.bind(this);

    const { content, isComplete = false, id = uuid() } = props;

    this.state = {
      id,
      isComplete,
      content,
      isEditMode: false,
      editText: ''
    };
  }

  render() {
    const { onDelete } = this.props;
    const { content } = this.state;

    const taskStyle = this.state.isComplete ? { color: '#2ac1bc' } : {};
    const CompleteButton = _ => (<button type="button" onClick={event => this.toggleState()}>Complete</button>);
    const DeleteButton = _ => (<button type="button" onClick={event => onDelete(this.getTaskId())}>Delete</button>);
    const EditButton = _ => (<button type="button" onClick={_ => this.setState({ isEditMode: true, editText: this.state.content })}>Edit</button>)

    return !!this.state.isEditMode ? (<li>
                                       <input type="text" value={this.state.editText} onChange={this.onChangeEditText.bind(this)} autoFocus={true}/>
                                        <button type="button" onClick ={ _ => this.editContent(this.state.editText)}>수정 완료</button>
                                        <button type="button" onClick>취소</button>
                                      </li>)
                                    : (<li>
                                        <span style={taskStyle}>{content}</span>
                                        <EditButton />
                                        <CompleteButton />
                                        <DeleteButton />
                                      </li>)
  }

  getTaskId() {
    return this.props.id || this.state.id;
  }

  onClickComplete() {
    this.toggleState();

    this.props.completeTodo(this.state.isComplete);
  }

  onClickEditContent() {
    this.editContent()

    const { content, id, isComplete } = this.state;

    this.props.onEdit(this.state.id, { content, id, isComplete });
  }

  async editContent(newContent) {
    await this.setState({
      content: newContent,
      isEditMode: false
    });

    const { content, id, isComplete } = this.state;

    this.props.onEdit(this.state.id, { content, id, isComplete });
  }

  toggleState(newState) {
    this.setState({
      isComplete: typeof newState ==='boolean' ? newState : !this.state.isComplete
    });
  }

  toggleEditMode(newState) {
    this.setState({
      isEditMode: typeof newState ==='boolean' ? newState : !this.state.isEditMode
    })
  }

  onChangeEditText(event) {
    this.setState({
      editText: event.target.value
    })
  }
}