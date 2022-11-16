const Post = require("../model/Post");
const User = require("../model/User");

const handleNewPost = async (req, res) => {
  const user = req.body.user;
  const content = req.body.content;
  const date = req.body.date;
  try {
    const lastPost = await Post.findOne().sort("-date").exec();
    const orderId = lastPost.orderId + 1;
    const result = await Post.create({
      user: user,
      content: content,
      date: date,
      orderId: orderId,
    });
    res.status(201).json({ post: result });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

const showPosts = async (req, res) => {
  const userid = req.session.userid;
  let id = req.body.postid;
  try {
    const user = await User.findOne({ username: userid }).exec();
    const following = [];
    for (follow in user.following) {
      following.push(user.following[follow].username);
    }
    following.push(userid);

    //El siguiente loop busca publicaciones por id
    //Cuando llega a 10 posts, devuelve el array de posts y la ultima id que encontró
    const posts = [];
    while (posts.length < 10 && id > 0) {
      const post = await Post.findOne({
        orderId: id,
        user: { $in: following },
      })
        .lean()
        .exec();
      if (post) posts.push(post);
      id--;
    }
    console.log(id);
    res.json({ posts: posts, lastId: id + 1 });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

const getPostId = async (req, res) => {
  user = req.body.user;
  content = req.body.content;
  date = req.body.date;
  try {
    const result = await Post.findOne({
      user: user,
      content: content,
      date: date,
    });
    res.status(201).json({ success: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleLike = async (req, res) => {
  const userid = req.body.userid;
  const postid = req.body.postid;
  const post = await Post.findById(postid).exec();
  if (post == null) {
    res.status(404).json({ message: "Post not found" });
  }
  if (!post.likes.filter((_userid) => _userid == userid).length) {
    //Si el atributo likes no tiene dentro de sí el usuario que le dio like, debemos incluirlo
    const newLikes = post.likes;
    newLikes.push(userid);
    Post.findByIdAndUpdate(post, { likes: newLikes }, (error, result) => {
      if (error) {
        res.status(500).json({ message: error });
      } else {
        res.status(204).json({ success: result });
      }
    });
  } else {
    //Si el usuario está, debemos sacarlo
    const newLikes = post.likes.filter((_userid) => _userid !== userid);
    Post.findByIdAndUpdate(post, { likes: newLikes }, (error, result) => {
      if (error) {
        res.status(500).json({ message: error });
      } else {
        res.status(204).json({ success: result });
      }
    });
  }
};

const getLikes = async (req, res) => {
  const postid = req.body.postid;
  try {
    const post = await Post.findById(postid).exec();
    const likes = post.likes;
    res.json({ likes });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getComentarios = async (req, res) => {
  const postid = req.params.postid;
  try {
    const post = await Post.findById(postid).exec();
    const comentarios = post.comments;
    res.json({ comentarios });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const handleNewComment = async (req, res) => {
  const user = req.body.user;
  const content = req.body.content;
  const date = req.body.date;
  const postid = req.body.postid;
  try {
    const post = await Post.findById(postid).exec();
    const newComments = post.comments;
    const newComment = {
      user: user,
      content: content,
      date: date,
    };
    post.comments.push(newComment);
    post.save();
    res.status(201).json({ comment: post.comments[post.comments.length - 1] });
    /*
        const result = await Post.findByIdAndUpdate(post, { comments: newComments }, (error, result) => {
            if (error) {
                res.status(500).json({ 'message': error });
            } 
        })
        const updatedPost = await Post.findById(postid).exec();
        console.log(updatedPost, updatedPost.comments, updatedPost.comments[updatedPost.comments.length-1]);
        res.status(201).json({ 'comment': updatedPost.comments[updatedPost.comments.length-1] });*/
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const matchAutores = async (req, res) => {
  const postid = req.body.postid;
  const userid = req.body.userid;
  try {
    const post = await Post.findById(postid).exec();
    if (post.user === userid) res.json({ match: true });
    else res.json({ match: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  const postid = req.body.postid;
  try {
    const post = await Post.findById(postid).exec();
    Post.findOneAndDelete({ _id: postid }, (err, docs) => {
      if (err) res.json({ message: err });
      else res.json({ success: "The post has been deleted" });
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const matchCommentAutores = async (req, res) => {
  const postid = req.body.postid;
  const commentid = req.body.commentid;
  const userid = req.body.userid;
  try {
    const post = await Post.findById(postid).exec();
    const comment = post.comments.filter(
      (comment) => comment._id.toString() === commentid
    )[0];
    if (comment.user === userid) res.json({ match: true });
    else res.json({ match: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  const postid = req.body.postid;
  const commentid = req.body.commentid;
  try {
    const post = await Post.findById(postid).exec();
    const comments = post.comments;
    //Filtramos el comentario cuya ID recibimos para eliminar
    const newComments = comments.filter(
      (comment) => comment._id.toString() !== commentid
    );
    //Actualizamos los comentarios del post sin el comentario que eliminamos
    Post.findOneAndUpdate(
      { _id: postid },
      { comments: newComments },
      (err, docs) => {
        if (err) res.json({ message: err });
        else res.json({ success: "The comment has been deleted" });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const editPost = async (req, res) => {
  const newContent = req.body.content;
  const postid = req.body.postid;
  try {
    await Post.findByIdAndUpdate(postid, { content: newContent }).exec();
    /*const post = await Post.findOneAndUpdate({ _id: postid }, {content:newContent}, (err,docs)=>{
            if (err) res.json({ 'message': err })
            else res.json({ 'success': 'The post has been updated' })
        });*/
    res.json({ success: newContent });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err });
  }
};

const editComment = async (req, res) => {
  const newContent = req.body.content;
  const postid = req.body.postid;
  const commentid = req.body.commentid;
  try {
    const post = await Post.findById(postid).exec();
    let comments = post.comments;
    for (comment in comments) {
      if (comments[comment]._id.toString() === commentid) {
        comments[comment].content = newContent;
      }
    }
    Post.findOneAndUpdate(
      { _id: postid },
      { comments: comments },
      (err, docs) => {
        if (err) res.json({ message: err });
      }
    );
    res.json({ success: newContent });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err });
  }
};

module.exports = {
  handleNewPost,
  showPosts,
  getPostId,
  handleLike,
  getLikes,
  getComentarios,
  handleNewComment,
  matchAutores,
  deletePost,
  matchCommentAutores,
  deleteComment,
  editPost,
  editComment,
};
