import React, {useState} from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import {useSelector} from 'react-redux';
import LikeDislikes from './LikeDislikes'

const { TextArea } = Input;

function SingleComment(props) {

    const user = useSelector(state => state.user);

    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success) {
                console.log(response.data.result)
                setCommentValue("")
                setOpenReply(false)
                props.refreshFunction(response.data.result)
            } else {
                alert('커멘트를 저장하지 못했습니다.')
            }
        })
    }

    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id} />
        , <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]


    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.author}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={ <p> {props.comment.content} </p>}
            />

            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <textarea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="write some comments"
                    />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
                </form>
            }

        </div>
    )
}

export default SingleComment
