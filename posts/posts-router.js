const express = require('express')
const router = express.Router()
const posts = require('../data/db')

router.get("/", (req, res) => {
	res.json({
		message: "This is working - yay",
	})
})

// GET---------------------------------


router.get("/posts", (req, res) => {

	posts.find() 
		.then((posts) => {
			res.status(200).json(posts)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error The posts information could not be retrieved.",
			})
		})
})

router.get("/posts/:id", (req, res) => {
	posts.findById(req.params.id)
		.then((post) => {
			if (post) {
				res.status(200).json(post)
			} else {
				res.status(404).json({
					message: "The post with the specified ID does not exist.",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "The post information could not be retrieved",
			})
		})
})

router.get("/posts/:id/comments", (req,res)=>{
   posts.findPostComments( req.params.id )
      .then( (response) => {
         if(response){
            res.json(response)
         }else{
            res.status(404).json( {message:"The post with the specified ID does not exist"} )
         }
      })
      .catch( (err) => { 
         console.log(err) // for developer
         res.status(500).json({ message:"The comments info could not be retrieved"}) 
      })
})

// POST--------------------------------

router.post("/posts", (req, res) => {
	if (!req.body.title || !req.body.contents) {
		return res.status(400).json({
			message: "Missing title or contents",
		})
	}

	posts.insert(req.body)
		.then((user) => {
			res.status(201).json(user)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "There was an error while saving the post to the database",
			})
		})
})
// ***DONT FORGET TO ADD "Post_Id" IN INSOMNIAC TESTING***
router.post("/posts/:id/comments", (req, res) => {
   //GET THE ID FROM THE URL
   posts.findPostComments( req.params.id )
      .then( (response) => {
         
         if(response){
            // THIS IS CHECKING THE REQUEST BODY FROM CLIENT
            if (!req.body.text) {
               return res.status(400).json({ message: "Please provide text for the comment" })
            }else{
               posts.insertComment(req.body)
                  .then( (post) => { res.status(201).json(post) })
                  .catch( (error) => { console.log(error)
                     res.status(500).json({
                        message: "There was an error while saving the comment to the database",
                     })
                  })
            }
            
         }else{
            res.status(404).json( {message:"The post with the specified ID does not exist"} )
         }
      })
      .catch( (err) => { console.log(err) // for developer
         res.status(500).json({ message:"The comments info could not be retrieved"}) 
      })

})



// PUT---------------------------------

router.put("/posts/:id", (req, res) => {

   if (!req.body.title || !req.body.contents) {
      res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
  } else {
      posts.update(req.params.id, req.body) // REVIEW THIS ORDER <--
         .then(() => {
             posts.findById(req.params.id)
               .then( (post) => {
                  if (post.length > 0) {
                     res.status(201).json(post);
                  } else {
                     res.status(404).json({ message: "The post with the specified ID does not exist." });
                  }
          })
          .catch( (err) => { console.log(err)
              res.status(500).json({ message: "Something went wrong. There was an error when trying to find a post with the specified ID." });
          })

      }).catch(err => { console.log(err)
          res.status(500).json({ error: "The post information could not be modified." })
      })
  }

})


// DELETE------------------------------

router.delete("/posts/:id", (req, res) => {
	posts.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({ message: "User has been deleted" })
			} else {
				res.status(404).json({ message: "The post with the specified ID does not exist" })
			}
		})
		.catch((error) => { console.log(error)
			res.status(500).json({ message: "Error removing the user" })
		})
})



module.exports = router