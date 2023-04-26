
import platform from '../img/grass.png'
import background from '../img/darkbackground.png'
import hills from '../img/foresty.png'
import bushes from '../img/bushes.png'
import trees1 from '../img/trees1.png'
import trees2 from '../img/trees2.png'
import clouds from '../img/cloudbackground.png'
import backgroundForest from '../img/backgroundforest.png'
import platformSmallTall from '../img/grass.png'
import spriteIdle from '../img/fullidlecrop.png'
import spriteIdleleft from '../img/fullidlecropleft.png'
import spriteRun from '../img/fullrunright.png'
import spriteRunLeft from '../img/Runcropleftheight.png'
import sprintLeft from '../img/Runcropleftheight.png'
import bomb from '../img/bomb.png'
    const canvas = document.querySelector('canvas')
    const c = canvas.getContext('2d')

    function createImage(imageSrc){

        const image = new Image();
        image.src = imageSrc;
        return image;
    }

    function createImageAsync(imageSrc){
        return new Promise((resolve) => 
        {const image = new Image();
        image.onload = () => {
            resolve(image)
        }
        image.src = imageSrc;} )
        
    }
    function platformCollision({object,platform}){
        return(
        object.position.y + object.height <= platform.position.y 
            && object.position.y + object.height + object.velocity.y >= platform.position.y 
            && object.position.x +object.width >= platform.position.x
            && object.position.x <= platform.position.x + platform.width
)
    }

    function collisionTop ({object1, object2}){
        return(
            object1.position.y + object1.height <= object2.position.y 
                && object1.position.y + object1.height + object1.velocity.y >= object2.position.y 
                && object1.position.x +object1.width >= object2.position.x
                && object1.position.x <= object2.position.x + object2.width
    )
    }
    // function objectsTouch({object1,object2}){
    //     return{}
    // }

    canvas.width = 1024
    canvas.height = 576


    const gravity = 0.5

    class Player {
        constructor(){
            this.speed = 5
            this.position = {
                x:100,
                y: 100
            }

            this.velocity = {
                x:0,
                y:0
            }
            this.width = 45
            this.height = 80
            this.image = createImage(spriteIdle)
            this.frames = 0
            this.sprites = {
                stand: {
                    right: createImage(spriteIdle),
                    left: createImage(spriteIdleleft),
                    cropWidth: 46
                },
                run: {
                    right: createImage(spriteRun),
                    left: createImage(sprintLeft),
                    cropWidth: 37

                }

                }
            this.currentSprite = this.sprites.stand.right
            this.currentCropWidth = 47
        }


        //drawing out our characterd
        draw(){
            c.drawImage(this.currentSprite,128 * this.frames,0,46,66, 
                this.position.x, this.position.y, this.width, this.height)
            
            // c.strokeStyle = 'red';
            // c.strokeRect(player.position.x, player.position.y, player.width,player.height)

        }

        update(){
            this.frames++
            if(this.frames > 6){ 
            this.frames = 0
            }
            this.draw()
            this.position.y += this.velocity.y
            this.position.x += this.velocity.x

            if(this.position.y + this.height + this.velocity.y <= canvas.height)
                this.velocity.y += gravity
        }
        
        
    }

    //Platform class
    class Platform{
        constructor({x, y, image}) {
            this.position = {
                x,
                y
            }

            this.image =image
            this.width = image.width
            this.height = image.height
            
        }

        //draws our platform images
        draw(){
            c.drawImage(this.image, this.position.x, this.position.y)
        }
    }

       //Background class
       class GenericObject{
        constructor({x, y, image}) {
            this.position = {
                x,
                y
            }

            this.image =image
            this.width = image.width 
            this.height = image.height 
            
        }

        //drawing out the image as our platform
        draw(){
            c.drawImage(this.image, this.position.x, this.position.y)
        }
    }

    class Enemy {
        constructor({position, velocity}){
            this.position = {
                x:position.x,
                y:position.y,
            }
            this.velocity = {
                x: velocity.x,
                y: velocity.y
            }

            console.log(velocity)
            console.log(position.x)
            console.log(position.x)
            this.width = 45
            this.height = 80
            this.image = createImage(sprintLeft)
            this.frames =0
        }
        

        draw(){
           c.drawImage(this.image,128 *this.frames,0,48,60,
            this.position.x, this.position.y, this.width, this.height)
                    
    
           
        }

        update() {
            this.frames++
            if(this.frames >= 7){ 
                this.frames = 0
                }
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            if(this.position.y + this.height + this.velocity.y <= canvas.height)
                this.velocity.y += gravity
        }
        
    }

    class Bullet {
        constructor({position, velocity,radius, color = 'white'}){
            this.position = {
                x:position.x,
                y:position.y,
            }
            this.velocity = {
                x: velocity.x,
                y: velocity.y
            }
            this.color = 'white'

            this.radius = radius
            console.log(velocity)
            console.log(position.x)
            console.log(position.x)
            this.width = 5
            this.height = 5
        }

        draw(){
            c.fillStyle= this.color
            c.fillRect(this.position.x,this.position.y, this.width,this.height)    
           
        }

        update() {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            if(this.position.y + this.height + this.velocity.y <= canvas.height)
                this.velocity.y
        }
    }

    class Obstacle {
        constructor(options) {
          this.position = options.position
          this.velocity = options.velocity
          this.width = options.width
          this.height = options.height
          this.color = options.color
        }
      
        update() {
          this.position.x += this.velocity.x
          this.position.y += this.velocity.y
        }
      
        draw(c) {
          c.fillStyle = this.color
          c.fillRect(this.position.x, this.position.y, this.width, this.height)
        }
      }
      
    
    let obstacles = []

    function generateObstacle() {
        let obstacle = new Obstacle({
          position: {
            x: Math.random() * canvas.width,
            y: 0
          },
          velocity: {
            x: 0,
            y: 5
          },
          width: 30,
          height: 30,
          color: 'green'
        })
      
        obstacles.push(obstacle)
      }
      
      setInterval(() => {
        generateObstacle()
      }, 2000)
    let platformImage
    let platformSmallTallImage 
    let bullets = []
    let spacebarPressed = false
    let timeBetweenBullets
    let lastKey
    let player = new Player()
    let platforms = []    
    let enemies = []
    let genericObjects = []
    let bulletActive = null
    let upPressed = false
    
    //checks if keys are pressed
    const keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }
    
    //lets us know how far we've scrolled
    let scrollOffset = 0
//initializing new life after lose condition
async function init(){
     platformImage = await createImageAsync(platform)
     platformSmallTallImage = await createImageAsync(platformSmallTall)
     console.log(platformSmallTallImage.width)
     
        player = new Player()
        enemies = [
            new Enemy({
            position : {
                x: 400,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            }
        }),
        new Enemy({
            position : {
                x: 1500,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            }
        }),
        new Enemy({
            position : {
                x: 1200,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            }
        }),
        new Enemy({
            position : {
                x: 1800,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            }
        }),
        new Enemy({
            position : {
                x: 3900,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            }
        }),
        new Enemy({
            position : {
                x: 4900,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            }
        }),
        new Enemy({
            position : {
                x: 5900,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            }
        }),
        new Enemy({
            position : {
                x: 2900,
                y: 100
            },
            velocity: {
                x: -0.1,
                y: 0
            }
        }), 
        new Enemy({
            position : {
                x: 1900,
                y: 100
            },
            velocity: {
                x: -0.1,
                y: 0
            }
        }), 
        new Enemy({
            position : {
                x: 3000,
                y: 100
            },
            velocity: {
                x: -0.1,
                y: 0
            }
        })
    ]
        platforms = [new Platform({
        x:-1, 
        y:520,
    image: platformImage
    }), 
    
    new Platform({x: platformImage.width *4 +250 +platformImage.width - platformSmallTallImage.width ,y :400, image: createImage(platformSmallTall)}),
    new Platform({x: platformImage.width *5 +250 +platformImage.width - platformSmallTallImage.width ,y :400, image: createImage(platformSmallTall)}),
    new Platform({x: platformImage.width -3 ,y :520, image: platformImage}),
    new Platform({x: platformImage.width *2 +100 ,y :520, image: platformImage}),
    new Platform({x: platformImage.width *3 +100 ,y :520, image: platformImage}),
    new Platform({x: platformImage.width *4 +200 ,y :520, image: platformImage}),
    new Platform({x: platformImage.width *6 +200 ,y :520, image: platformImage})
    ,
    new Platform({x: platformImage.width *7 +200 ,y :320, image: platformImage})
    ,
    new Platform({x: platformImage.width *8 +250 ,y :220, image: platformImage})
    ,
    new Platform({x: platformImage.width *9 +300 ,y :120, image: platformImage})
    ,
    new Platform({x: platformImage.width *10 +350 ,y :20, image: platformImage})
    ,
    new Platform({x: platformImage.width *11 +400 ,y :520, image: platformImage})
]    

      genericObjects = [
      new GenericObject({
        x:0,
        y:0,
        image: createImage(background)
      }),
      new GenericObject({
        x:40,
        y:350,
        image: createImage(bushes)
      }),
      new GenericObject({
        x:0,
        y:0,
        image: createImage(clouds)
      }),
      new GenericObject({
        x:250,
        y:0,
        image: createImage(backgroundForest)
      }),
      new GenericObject({
        x:0,
        y:0,
        image: createImage(hills)
      })
    ]

    scrollOffset = 0
}


    //loop that changes the position of the player (gravity)

    function animate() {
        requestAnimationFrame(animate)
        c.fillStyle= 'white'
        c.fillRect(0,0,canvas.width,canvas.height)

        genericObjects.forEach((genericObject) => {
          genericObject.draw()
        })
        
        
        //adds in the platforms
        platforms.forEach((platform) => {
            platform.draw()
        })
        
        bullets.forEach((bullet,i) =>{
            bullet.update()
            if(bullet.position.x >= canvas.width || bullet.position.x <= 0){
                bullets.splice(i,1)

                if (bullet === bulletActive) { // if the active bullet was removed, set the activeBullet variable to null
                    bulletActive = null
                  }
                  spacebarPressed = false
                }
        })
        obstacles.forEach((obstacle, index) => {
            if (
              player.position.x < obstacle.position.x + obstacle.width &&
              player.position.x + player.width > obstacle.position.x &&
              player.position.y < obstacle.position.y + obstacle.height &&
              player.position.y + player.height > obstacle.position.y
            ) {
             
              init()
            
            }
          
            obstacle.update()
            obstacle.draw(c)
          
            // remove obstacle if it goes offscreen
            if (obstacle.position.y > canvas.height) {
              obstacles.splice(index, 1)
            }
          })

        enemies.forEach((enemy,index) => {
            enemy.update()
        
            //kill  enemy on bullet hit
            bullets.forEach((bullet, bulletIndex) => {
                
                if (bullet.position.x >= enemy.position.x  &&
                    bullet.position.y >= enemy.position.y &&
                    bullet.position.x <= enemy.position.x + enemy.width &&
                    bullet.position.x <= enemy.position.x + enemy.height   &&
                    bullet.position.y <= enemy.position.y + enemy.height  
                    ){ 
                        enemies.splice(index, 1)
                        bullets.splice(bulletIndex, 1)
                        bulletActive = null
                      
                    }
                }
                )
            if(collisionTop({
                object1: player,
                object2: enemy
            }))
            {
                player.velocity.y -= 10
                // setTimeout(() => {})

                enemies.splice(index,1)
                
            }
            else if (

                player.position.x + player.width >= enemy.position.x 
                && 
                player.position.y + player.height >= enemy.position.y
                && 
                player.position.x <= enemy.position.x + enemy.width
            
                
                )
                init()
        })
        
        player.update()
        

        //if statement for when we have the right and left keys pressed
        if(keys.right.pressed && player.position.x < 400){
            player.velocity.x = 5
        }
        else if((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset == 0 && player.position.x>0)) {
            player.velocity.x = -5
        }
        else
        {player.velocity.x = 0
        //THIS IS OUR SCROLL CODE SO THAT THE OBJECTS ARE STATIONARY WHEN WE MOVE
            if(keys.right.pressed){
                scrollOffset += player.speed
                platforms.forEach(platform => {
                    platform.position.x -= player.speed 
                })

                genericObjects.forEach(genericObject => {
                  genericObject.position.x -= player.speed * 0.66
                })

                enemies.forEach(enemy => {
                    enemy.position.x -= player.speed 
                  })
                  obstacles.forEach(obstacle => {
                    obstacle.position.x -= player.speed 
                  })
                
            }
            else if(keys.left.pressed && scrollOffset > 0){
                scrollOffset -= player.speed
                platforms.forEach(platform => {
                    platform.position.x += player.speed
                })

                genericObjects.forEach(genericObject => {
                  genericObject.position.x += player.speed * 0.66
                })

                enemies.forEach(enemy => {
                    enemy.position.x += player.speed 
                  })

                  obstacles.forEach(obstacle => {
                    obstacle.position.x += player.speed 
                  })
                
            }
        }
        

        //adding rectangular platform collision detection
        platforms.forEach((platform) => {
        if(
            platformCollision({
            object: player,
            platform: platform
        })
        ){
            player.velocity.y = 0
            upPressed = true

        }
    
        enemies.forEach((enemy) => {
        if(
            platformCollision({
            object: enemy,
            platform: platform
        })
        )
            enemy.velocity.y = 0
            // deathAnimation()
        })

        bullets.forEach((bullet) => {
            if(
                platformCollision({
                object: bullet,
                platform: platform
            })
            )
                bullet.velocity.y = 0
                // deathAnimation()
            })

    })
    
    
    
    
    



    
    

    //win scenario
    if(scrollOffset > 6000) {
        console.log('you win')
        c.font = "30px Arial"
        c.fillStyle = 'red'
        c.textAlign = 'center'
        c.fillText("YOU WIN",500,500)
        // setTimeout(init, 5000)
        
    }

    console.log(player.position.y)
    console.log(canvas.height)
    if(player.position.y > canvas.height){
        init()
     }
    }
    console.log(init);
    init();
    animate();

    addEventListener('keydown', ({ keyCode }) => {
    //switch statement for when players use the movement keys
    switch (keyCode){
        case 65:
            console.log('left')
            keys.left.pressed = true
            lastKey = 'left'
            player.currentSprite = player.sprites.run.left
            player.currentCropWidth = player.sprites.run.cropWidth
            break
        case 83:
            console.log('down')
            lastKey = 'down'
            break
        case 68:
            console.log('right')
            keys.right.pressed = true
            lastKey = 'right'
            player.currentSprite = player.sprites.run.right
            player.currentCropWidth = player.sprites.run.cropWidth
            break
        case 87:
            console.log('up')
            upPressed = false
            // lastKey = 'up'
            break
        case 32:
            console.log('space')
            console.log(spacebarPressed)
            if (!bulletActive){
            if (!spacebarPressed) {
                let velocity = 10
                if(lastKey === 'left') {
                    velocity = -10
                }
                bullets.push(new Bullet({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y + player.height /2
                    },
                    velocity: {
                        x: velocity,
                        y :0
                    },
                    color: 'white'
                }))
                // set the flag to true to indicate that the spacebar is now pressed
                spacebarPressed = true
                bulletActive = bullets[bullets.length -1]
            }}
            break
        
    }})

    addEventListener('keyup', ({ keyCode }) => {
        //switch statement for when players let up on the keypad (the moment they stop pressing the button)
        switch (keyCode){
            case 65:
                console.log('left')
                keys.left.pressed = false
                player.currentSprite = player.sprites.stand.left
                break
            case 83:
                console.log('down')
                break
            case 68:
                console.log('right')
                // player.velocity.x = 0
                keys.right.pressed = false
                player.currentSprite = player.sprites.stand.right
                break
            case 87:
                console.log('up')
                if (upPressed) {
                player.velocity.y -= 14
                upPressed = true
                }
                
                break
            case 32:
                spacebarPressed = false
            
        }
    
        console.log(keys.right.pressed)
    })

