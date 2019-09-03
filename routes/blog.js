var express = require('express');
var router = express.Router();

const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')
const loginCheck = require('../middleware/loginCheck')
const {SuccessModel,ErrorModel} = require('../model/resModel')

/* GET 获取博客列表 */
router.get('/list', (req, res, next) => {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    const result = getList(author,keyword)
    return result.then(listData => {
        res.json(
            new SuccessModel (listData)
        ) 
    })
});

/* GET 获取博客详情 */
router.get('/detail', (req, res, next) => {
    const result = getDetail(req.query.id)
    return result.then(data => {
        res.json(
            new SuccessModel (data)
        ) 
    })
});

/* POST 新建博客 */
router.post('/new', loginCheck,(req, res, next) => {
    req.body.author = req.session.username 
    const result = newBlog(req.body)
    // console.log(typeof(result),result)
    return result.then(data => {
        console.log(data);
        res.json(
            new SuccessModel(data)
        )
    })
});

/* POST 更新博客 */
router.post('/update', loginCheck,(req, res, next) => {
    const result = updateBlog(req.query.id,req.body)
    return result.then(val => {
        if(val){
            res.json(
                new SuccessModel ('更新博客成功')
            )
        }else{
            res.json(
                new ErrorModel ('更新博客失败')
            )
        }
    })
});

/* POST 删除博客 */
router.post('/del', loginCheck,(req, res, next) => {
    const author = req.session.username
    const result = delBlog(id,author)
    return result.then(val => {
        if(val){
            res.json(
                new SuccessModel ()
            )
        }else{
            res.json(
                new ErrorModel ('删除博客失败')
            )
        }
    })
});

module.exports = router;
