import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import Button from '../atoms/Button';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import CommunityButtonGroup from './CommunityButtonGroup';
import Modal from '../atoms/Modal';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, openModal } from '../../redux/slice/modalSlice';

import { postData, comment } from '../../pages/CommunityPostDetailPage';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type ApiState = {
  api: {
    APIURL: string;
  };
};

type UserState = {
  user: {
    accessToken: string | null;
    username: string;
    id: string;
    // id: number;
    stamp: number;
  };
};

const HeaderButtons = ({ post }: { post: postData }) => {
  const USERACCESSTOKEN = useSelector((state: UserState) => state.user.accessToken);

  const APIURL = useSelector((state: ApiState) => state.api.APIURL);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function postModifyHandler() {
    // 게시물 정보와 함께 postwrite로 이동
    navigate(`/community/postwrite`, { state: { post } });
  }

  function postDeleteHandler() {
    console.log(USERACCESSTOKEN);
    console.log(APIURL);
    // 게시글 삭제 요청 처리 후 게시판으로 이동
    axios
      .delete(`${APIURL}/posts/${post.postId}`, {
        headers: {
          Authorization: `${USERACCESSTOKEN}`,
        },
      })
      .then(function (response) {
        closeModal('deletePostModal');
        navigate(`/community`);
      })
      .catch(function (error) {
        console.log('게시물 삭제 실패');
        console.log(error);
      });
  }

  function postDeleteModalHandler() {
    dispatch(openModal('deletePostModal'));
  }

  return (
    <div className="header-buttons">
      {/* 삭제 예 -> 서버에 delete 요청 */}
      <Modal className="post-delete" modaltype="deletePostModal">
        <div>해당 게시글을 삭제하시겠습니까?</div>
        <ModalButtons>
          <Button onClick={postDeleteHandler}>예</Button>
          <Button
            onClick={() => {
              dispatch(closeModal('deletePostModal'));
            }}>
            아니요
          </Button>
        </ModalButtons>
      </Modal>

      <Button width="60px" fontSize={1} hoverBgColor="#7092bf" hoverColor="white" onClick={postModifyHandler}>
        수정
      </Button>
      <Button width="60px" fontSize={1} hoverBgColor="#7092bf" hoverColor="white" onClick={postDeleteModalHandler}>
        삭제
      </Button>
    </div>
  );
};

const CommentButtons = ({
  comment,
  postid,
  commentList,
  setCommentList,
  setIsCommentModify,
}: {
  comment: comment;
  postid: number | undefined;
  commentList: Array<comment>;
  setCommentList: React.Dispatch<React.SetStateAction<Array<comment> | undefined>>;
  setIsCommentModify: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const USERACCESSTOKEN = useSelector((state: UserState) => state.user.accessToken);
  const APIURL = useSelector((state: ApiState) => state.api.APIURL);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function commentModifyHandler() {
    // 댓글 정보를 가지고 수정..
    setIsCommentModify(comment.commentId);
  }

  function postDeleteHandler() {
    // 댓글 삭제 낙관적 업데이트
    if (commentList !== undefined) {
      const deletedCommentList = commentList.filter(item => item.commentId !== comment.commentId);
      setCommentList(deletedCommentList);
    }

    axios
      .delete(`${APIURL}/posts/comment/${comment.commentId}`, {
        headers: {
          Authorization: `${USERACCESSTOKEN}`,
        },
      })
      .then(function (response) {
        closeModal('deletePostModal');
      })
      .catch(function (error) {
        console.log('댓글 삭제 실패');
        console.log(error);
      });
  }

  function commentDeleteModalHandler() {
    dispatch(openModal('deleteCommentModal'));
  }

  return (
    <div className="comment-buttons">
      {/* 삭제 예 -> 서버에 delete 요청 */}
      <Modal className="post-delete" modaltype="deleteCommentModal">
        <div>해당 댓글을 삭제하시겠습니까?</div>
        <ModalButtons>
          <Button onClick={postDeleteHandler}>예</Button>
          <Button
            onClick={() => {
              dispatch(closeModal('deleteCommentModal'));
            }}>
            아니요
          </Button>
        </ModalButtons>
      </Modal>

      <Button
        width="30px"
        fontSize={0.7}
        border="0px"
        hoverBgColor="#7092bf"
        hoverColor="white"
        onClick={commentModifyHandler}>
        수정
      </Button>
      <Button
        width="30px"
        fontSize={0.7}
        border="0px"
        hoverBgColor="#7092bf"
        hoverColor="white"
        onClick={commentDeleteModalHandler}>
        삭제
      </Button>
    </div>
  );
};

function CommentDetail({
  commentList,
  setCommentList,
  post,
}: {
  commentList: Array<comment>;
  setCommentList: React.Dispatch<React.SetStateAction<Array<comment> | undefined>>;
  post: postData;
}) {
  const USERID = useSelector((state: UserState) => state.user.id);
  const [isCommentModify, setIsCommentModify] = useState(0);
  return (
    <div className="post-comment-container">
      {commentList.map((item, index) => {
        if (item.commentId === isCommentModify) {
          return (
            <CommentModify
              initComment={item}
              postid={post.postId}
              commentList={commentList}
              setIsCommentModify={setIsCommentModify}
              setCommentList={setCommentList}
            />
          );
        }
        return (
          <div className="post-comment" key={index}>
            {/* 헤더 유저네임, item.usename 같은지 조건부 버튼 렌더 */}
            {item.memberId === USERID && (
              <CommentButtons
                comment={item}
                postid={post.postId}
                setIsCommentModify={setIsCommentModify}
                commentList={commentList}
                setCommentList={setCommentList}
              />
            )}
            <div className="comment-detail">
              <p className="comment-user">{item.username}</p>
              <p className="comment-content">{item.content}</p>
            </div>
            <div className="comment-date">{item.createdAt}</div>
          </div>
        );
      })}
    </div>
  );
}

function CommentModify({
  initComment,
  postid,
  commentList,
  setIsCommentModify,
  setCommentList,
}: {
  initComment: comment;
  postid: number | undefined;
  commentList: Array<comment>;
  setIsCommentModify: React.Dispatch<React.SetStateAction<number>>;
  setCommentList: React.Dispatch<React.SetStateAction<Array<comment> | undefined>>;
}) {
  const USERACCESSTOKEN = useSelector((state: UserState) => state.user.accessToken);
  const APIURL = useSelector((state: ApiState) => state.api.APIURL);
  const [comment, setComment] = useState(initComment.content);

  function changeCommentHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment((event.target as HTMLTextAreaElement).value);
  }
  // 댓글 등록 버튼 클릭 함수
  function submitCommentHandler() {
    console.log(comment);
    const commentData = {
      content: comment,
    };
    //댓글 수정 낙관적 업데이트
    console.log(JSON.stringify(commentData));
    setCommentList([
      ...commentList,
      {
        memberId: initComment.memberId,
        commentId: initComment.commentId,
        content: comment,
        username: initComment.username,
        createdAt: initComment.createdAt,
        updatedAt: initComment.updatedAt,
      },
    ]);
    axios({
      method: 'patch',
      url: `${APIURL}/posts/comment/${initComment.commentId}`,
      data: JSON.stringify(commentData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${USERACCESSTOKEN}`,
      },
    })
      .then(response => {
        console.log('댓글 수정 성공');
        setIsCommentModify(0);
        // window.location.reload();
      })
      .catch(error => {
        console.log(error);
        console.log('댓글 수정 실패');
      });
  }
  return (
    <div className="post-comment-add">
      <div className="post-comment-add-user">{initComment.username}</div>
      <textarea
        className="post-comment-add-content"
        placeholder="댓글을 남겨주세요"
        value={comment}
        onChange={changeCommentHandler}></textarea>
      <div className="post-comment-submit">
        <Button width="70px" fontSize={1} hoverBgColor="#7092bf" hoverColor="white" onClick={submitCommentHandler}>
          수정
        </Button>
      </div>
    </div>
  );
}

function CommentAdd({
  commentList,
  setCommentList,
  postid,
}: {
  commentList: Array<comment> | undefined;
  setCommentList: React.Dispatch<React.SetStateAction<Array<comment> | undefined>>;
  postid: number | undefined;
}) {
  const USERACCESSTOKEN = useSelector((state: UserState) => state.user.accessToken);
  const USERID = useSelector((state: UserState) => state.user.id);
  const USERNAME = useSelector((state: UserState) => state.user.username);
  const APIURL = useSelector((state: ApiState) => state.api.APIURL);
  const [comment, setComment] = useState('');

  const today = new Date();
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + today.getDate()).slice(-2);
  const hours = ('0' + today.getHours()).slice(-2);
  const minutes = ('0' + today.getMinutes()).slice(-2);
  const seconds = ('0' + today.getSeconds()).slice(-2);

  const dateString = year + '-' + month + '-' + day;
  const timeString = hours + ':' + minutes + ':' + seconds;

  console.log(timeString);

  function changeCommentHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment((event.target as HTMLTextAreaElement).value);
  }
  // 댓글 등록 버튼 클릭 함수
  function submitCommentHandler() {
    console.log(comment);
    const commentData = {
      content: comment,
    };

    if (commentList !== undefined) {
      setCommentList([
        ...commentList,
        {
          memberId: USERID,
          commentId: commentList[commentList?.length - 1].commentId + 1,
          content: comment,
          username: USERNAME,
          createdAt: `${dateString} ${timeString}`,
          updatedAt: null,
        },
      ]);
    }

    console.log(JSON.stringify(commentData));
    axios({
      method: 'post',
      url: `${APIURL}/posts/${postid}/comment`,
      data: JSON.stringify(commentData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${USERACCESSTOKEN}`,
      },
    })
      .then(response => {
        console.log('댓글 등록 성공');
        if (response.status === 200) {
          // navigate(`/community`);
          window.location.reload();
        }
      })
      .catch(error => {
        console.log(error);
        console.log('댓글 등록 실패');
      });
  }
  return (
    <div className="post-comment-add">
      <div className="post-comment-add-user">User</div>
      <textarea
        className="post-comment-add-content"
        placeholder="댓글을 남겨주세요"
        value={comment}
        onChange={changeCommentHandler}></textarea>
      <div className="post-comment-submit">
        <Button width="70px" fontSize={1} hoverBgColor="#7092bf" hoverColor="white" onClick={submitCommentHandler}>
          등록
        </Button>
      </div>
    </div>
  );
}

function PostDetail({ post }: { post: postData }) {
  // const USERID = localStorage.getItem("id");
  const USERID = useSelector((state: UserState) => state.user.id);
  const USERACCESSTOKEN = useSelector((state: UserState) => state.user.accessToken);
  const APIURL = useSelector((state: ApiState) => state.api.APIURL);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeList, setLikeList] = useState<Array<string> | undefined>(post.likedByUserIds);
  const [likeCount, setLikeCount] = useState<number | undefined>(post.likes);
  const [commentList, setCommentList] = useState<Array<comment> | undefined>(post.comments);

  const navigate = useNavigate();
  function goToCommunityHandler() {
    navigate(`/community`);
  }

  console.log(USERID);
  //좋아요 상태 변경
  useEffect(() => {
    if (post.likedByUserIds !== undefined && post.postId !== undefined) {
      // if (post.myLikes.includes(UERID)) {}
      console.log(typeof USERID);
      console.log(USERID);
      console.log(post.likedByUserIds);
      console.log(post.likedByUserIds.includes(USERID));
      if (post.likedByUserIds.includes(USERID)) {
        setIsLiked(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!isLiked) {
      console.log(likeList);
      if (likeList !== undefined) {
        setLikeList([...likeList, USERID]);
      }
    } else {
      console.log(likeList);
      if (likeList !== undefined) {
        setLikeList(likeList.slice(0, likeList.length - 1));
      }
    }
  }, []);

  // 좋아요 클릭시..요청
  function changeLikeHandler() {
    if (USERID === '0') {
      const tryLogin = confirm('회원만 이용 가능한 기능입니다. 로그인 하시겠습니까?');
      console.log(tryLogin);
      if (tryLogin) {
        navigate('/login');
      }
    } else {
      setIsLiked(!isLiked);
      if (likeCount !== undefined) {
        if (!isLiked && likeList !== undefined) {
          setLikeCount(likeCount + 1);
          setLikeList([...likeList, USERID]);
        } else {
          setLikeCount(likeCount - 1);
          if (likeList !== undefined) {
            setLikeList(likeList.slice(0, likeList.length - 1));
          }
        }
      }
      axios({
        method: 'post',
        url: `${APIURL}/posts/${post.postId}/likes`,
        headers: {
          Authorization: `${USERACCESSTOKEN}`,
        },
      })
        .then(response => {
          console.log('좋아요 성공');
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  return (
    <PostDetailLayout>
      <PostDetailHeader>
        <h2>{post.title}</h2>
        <div className="header-detail-container">
          <div className="header-detail">
            <div className="post-user">{post.username}</div>
            <div className="post-date">{post.createdAt}</div>
            <div className="post-view"> 조회수: {post.views}</div>
          </div>
          {USERID === post.memberId && <HeaderButtons post={post} />}
          {/* <HeaderButtons post={post} /> */}
        </div>
      </PostDetailHeader>
      <PostDetailContent>
        <div>{post.content ? <div dangerouslySetInnerHTML={{ __html: post.content }}></div> : null}</div>
      </PostDetailContent>
      <PostDetailFooter>
        <div className="lick-count-container">
          {isLiked && likeList?.includes(USERID) ? (
            <AiFillHeart className="aifillheart" onClick={changeLikeHandler} />
          ) : (
            <AiOutlineHeart className="aioutlineheart" onClick={changeLikeHandler} />
          )}
          <div>{likeCount}</div>
        </div>
        <Button
          width="65px"
          height="30px"
          borderRadius="15px"
          fontSize={1}
          hoverBgColor="#7092bf"
          hoverColor="white"
          onClick={goToCommunityHandler}>
          목록
        </Button>
      </PostDetailFooter>

      <PostFooter>
        {/* 댓글 리스트 map으로 */}
        {commentList ? <CommentDetail commentList={commentList} setCommentList={setCommentList} post={post} /> : null}
        {/* {post.comments ? <CommentDetail comment={post.comments} post={post} /> : null} */}
        {USERID !== '0' ? (
          <CommentAdd commentList={commentList} setCommentList={setCommentList} postid={post.postId} />
        ) : (
          <div className="not-login-comment">
            로그인하시면 댓글을 작성할 수 있습니다. <Link to={'/login'}>로그인 페이지로...</Link>
          </div>
        )}
      </PostFooter>

      <CommunityButtonGroup left="77%" top="85%" />
    </PostDetailLayout>
  );
}

export default PostDetail;

const PostDetailLayout = styled.div`
  width: 748px;
  height: auto;
  border: 1px solid #9a9fa1;
  background-color: #eceff1;
  margin: 0 auto;
  padding: 20px;
  border-radius: 15px;
  justify-content: center;
  @media all and (max-width: 770px) {
    width: 80%;
  }
`;

const PostDetailHeader = styled.div`
  padding: 15px;
  background-color: #fcfcfc;
  border: 1px solid #a8adaf;
  border-radius: 15px;
  margin-bottom: 20px;
  div.header-detail-container {
    display: flex;
    justify-content: space-between;
  }
  div.header-detail-container div.header-detail {
    font-size: 15px;
    display: flex;
  }
  div.header-detail-container div.header-detail div {
    margin: 3px 4px;
  }
  div.header-detail-container div.post-date {
    font-size: 15px;
  }
  div.header-buttons button {
    margin-left: 5px;
  }
`;

const PostDetailContent = styled.div`
  padding: 20px;
  background-color: #fcfcfc;
  border: 1px solid #a8adaf;
  border-radius: 15px;
  margin-bottom: 20px;
`;

const PostDetailFooter = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  border-radius: 15px;
  margin-bottom: 20px;
  div.lick-count-container {
    display: flex;
    margin: 0 10px;
    font-size: 20px;
  }
  div.lick-count-container svg {
    font-size: 30px;
    margin: 0 5px;
  }
  div.lick-count-container svg.aifillheart {
    font-size: 30px;
    margin: 0 5px;
    color: #e7325f;
  }
  div.lick-count-container svg:hover {
    font-size: 32px;
    cursor: pointer;
  }
  button {
    margin: 0 15px;
  }
`;

const PostFooter = styled.div`
  div.not-login-comment {
    padding: 10px;
    margin-bottom: 10px;
    background-color: #fcfcfc;
    border: 1px solid #a8adaf;
    border-radius: 15px;
  }
  div.post-comment-container div.post-comment {
    padding: 10px;
    margin-bottom: 10px;
    background-color: #fcfcfc;
    border: 1px solid #a8adaf;
    border-radius: 15px;
  }
  div.post-comment div.comment-detail {
    display: flex;
  }
  div.post-comment p.comment-user {
    width: 80px;
    font-size: 14px;
    font-weight: 600;
    padding: 0 10px;
  }
  div.post-comment p.comment-content {
    font-size: 15px;
    padding: 0 10px;
  }
  div.post-comment div.comment-date {
    display: flex;
    justify-content: right;
    font-size: 12px;
    color: gray;
  }
  div.post-comment div.comment-buttons {
    display: flex;
    justify-content: right;
  }
  div.post-comment-add {
    margin: 5px 0px;
    padding: 10px;
    background-color: #fcfcfc;
    border: 1px solid #a8adaf;
    border-radius: 15px;
  }
  div.post-comment-add div.post-comment-add-user {
    font-size: 14px;
    font-weight: 600;
    padding: 5px;
  }
  div.post-comment-add textarea.post-comment-add-content {
    margin-top: 5px;
    width: 98%;
    height: 100px;
    border-radius: 10px;
    padding: 1%;
  }
  div.post-comment-add div.post-comment-submit {
    margin-top: 5px;
    display: flex;
    justify-content: right;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  button {
    width: 100px;
    margin: 0px 10px;
  }
`;
