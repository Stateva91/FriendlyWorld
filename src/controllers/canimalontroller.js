const router=require('express').Router();

const photoManager=require('../managers/photoManager');
const {getErrorMessage}=require('../utils/errorHelpers');
const {isAuth}=require('../middlewares/authMiddleware');

router.get('/', async(req, res)=>{
    const photos= (await photoManager.getAll().lean());

    res.render('animals', {photos});
});

router.get('/create', isAuth, (req, res)=>{
    res.render('animals/create');

});

router.post('/create', isAuth,async(req, res)=>{
    const photoData={
        ...req.body,
        owner:req.user._id,
    };


    try{
        await photoManager.create(photoData);
        res.redirect('/animals');
    } catch (err){
      res.render('animals/create', {error:getErrorMessage(err)});
    }
});

router.get('/:animalId/details', async (req, res)=>{

    const photoId= req.params.photoId;
    const photo=await photoManager.getOne(photoId).populate('comments.user').lean();
    const isOwner=req.user?._id==photo.owner._id;

    res.render('animals/details', {photo, isOwner});
});

router.get('/:photoId/delete',isAuth, async(req, res)=>{

    const photoId=req.params.photoId;

    try{
    await photoManager.delete(photoId);
    res.redirect('/animals');
    } catch(err){
    res.render(`/animals/details`, {error: 'Unsuccessful photo deletion'});
    }
});

router.get('/:animalId/edit',isAuth, async(req, res)=>{
    const photo=await photoManager.getOne(req.params.photoId).lean();
    res.render('animals/edit', {photo});
});

router.post('/:animalId/edit', isAuth, async(req, res)=>{
    const photoId=req.params.photoId;
    const photoData=req.body;
    try {
  await photoManager.edit(photoId, photoData);

  res.redirect(`/animals/${photoId}/details`);
    } catch (err){
        res.render('animals/edit', {error: 'Unable to update photo', ...photoData});
    }
});

router.post('/:animalId/comments', isAuth, async(req, res)=>{
    const photoId=req.params.photoId;
    const {message}=req.body;
    const user=req.user._id;

    await photoManager.addComment(photoId, {user, message});

    res.redirect(`/animals/${photoId}/details`);

})
module.exports=router;