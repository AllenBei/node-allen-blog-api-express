var express = require('express');
var router = express.Router();

const {login} = require('../controller/user')
const {SuccessModel,ErrorModel} = require('../model/resModel')

//next作用就是继续往下跑，不return 
router.post('/login', function(req, res, next) {
   const {username,password} = req.body 
   const result = login(username,password)
   return result.then (data => {
       if(data.username){
           //设置session  若退出注销用req.session.destroy();
           req.session.username = data.username
           req.session.realname = data.realname
           req.session.save();
        //    console.log('登录获取session的ID：===='+req.session.id)
        //    console.log(redisClient.get('realname'))
           res.json(
            new SuccessModel()
           )
           return;
       }
       res.json(
        new ErrorModel('登录失败')
       )
   })
});

router.get('/login-test',(req,res,next) => {
    //拿不到数据是因为session ID不一样，创建了新的，是用户凭证的cookie没携带！
    //默认情况下，标准的跨域请求是不会发送cookie等用户认证凭据的，XMLHttpRequest 2的一个重要改进就是提供了对授信请求访问的支持。
    // console.log('测试获取session的ID：===='+req.session.id)
    if (req.session.username){
        res.json({
            errno:0,
            msg:'testing successfully'
        })
        return;
    }
    res.json({
        errno:-1,
        msg:'未登录'
    })
})

module.exports = router;