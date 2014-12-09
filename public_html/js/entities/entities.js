game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "mario",
                spritewidth: "128",
                spriteheight: "128",
                width: 128,
                height: 128,
                getShape: function() {
                    return (new me.Rect(0, 0, 30, 128)).toPolygon();
                }
            }]);
//creat an amnimation called small walk using pictures of image defined above()
//sets the amnimation to run through pictures
// the last numbers says we switch between pictures every 80 miliseconds

        this.renderable.addAnimation("idle", [13]);
       this.renderable.addAnimation("bigIdle", [19]);
        this.renderable.addAnimation("smallWalk", [8, 9, 10, 11, 12, 13], 80);
        this.renderable.addAnimation("bigWalk", [14,15,16,17,18,19], 80);
        this.renderable.addAnimation("shrink", [0, 1, 2, 3], 80);
        this.renderable.addAnimation("grow", [4, 5, 6, 7], 80);
       
        this.renderable.setCurrentAnimation("idle");
        //sets the speed when we set the x axis (frist number) and y axis(second number)
        this.big = false;
        this.body.setVelocity(5, 20);
        //sets the camrea(view port) to follow mario's positions on both x and y
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },
    update: function(delta) {
       //checks if the right key is pressed and if it is, executes the following statement
        if(me.input.isKeyPressed("right")){
            //sets position of the mario on the x axis by adding the x value from the setVelocity times the timer.tick
            //me.timer.tick uses the time since last animation to make the distance tralved smooth
            console.log("right");
            this.body.vel.x += this.body.accel.x * me.timer.tick;
      
            
        }else{
            this.body.vel.x = 0;
        }
        
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
//        move it away from the bad guy
        if(!this.big){
            if (this.body.vel.x !== 0) {
                if (!this.renderable.isCurrentAnimation("smallWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink"))
                    ;
                //walking methods that help it shrink when it hits the mushroom
                if (!this.renderable.isCurrentAnimation("smallWalk")) {
                    this.renderable.setCurrentAnimation("smallWalk");
                    this.renderable.setAnimationFrame();
                }

            }else{
                this.renderable.setCurrentAnimation("idle");
            }
        }else{
             if (this.body.vel.x !== 0) {
                if (!this.renderable.isCurrentAnimation("bigWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink"))
                    ;
                if (!this.renderable.isCurrentAnimation("bigWalk")) {
                    this.renderable.setCurrentAnimation("bigWalk");
                    this.renderable.setAnimationFrame("shrink");
                }

            } else {
                this.renderable.setCurrentAnimation("bigidle");
            }
        }
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    collideHandler: function(response){
        var ydif = this.pos.y - response.b.pos.y;{
            console.log(ydif);
        }
        if(response.b.type === 'badguy'){
            if(ydif <= -115){
                response.b.alive = false;
            }else{
                if(this.big){
                this.big = false;
                    this.body.vel.y -= this.body.accel.y * me.timer.tick;
                this.jumping = true;
                this.renderable.setCurrentAnimation("shrink", "idle");
                this.renderable.setCurrentAnimationframe();
                    me.state.change(me.state.MENU);
            }
            }
            
        }else if (response.b.type === 'mushroom'){
            this.renderabble.setCurrentAnimation("grow", "bigIdle");
            this.big = true;
            me.game.world.removeChild(response.b);
        }
            console.log("Big!");
        }
    });
game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, settings]);
        //if something hits with this object then we call the onCollisions function and pass
        //it a hidden parameter of this object
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xSpawn = settings.xSpawn;
        this.ySpawn = settings.ySpawn;
    },
    onCollision: function(){
       //set this object to only collide with objects that exist of type NO_objects wich dont exist
       //so really, make it so that will not collide with anything more
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
    }
});

game.BadGuy = me.Entity.extend({
        init: function(x, y, settings){
            this._super(me.Entity, 'init', [x, y, {
                image: "slime",
                spritewidth: "60",
                spriteheight: "28",
                width: 60,
                height: 28,
                getShape: function() {
                    return (new me.Rect(0, 0, 00, 28)).toPolygon();
                }
            }]);
        this.spritewidth = 60;
        var width = settings.width;
        x = this.startX = x;
        this.endX = x + width - this.spritewidth;
        this.pos.x = x + width -this.spritewidth;
        this.updateBounds();
        
        this.alwaysUpdate = true;
        
        this.walkLeft = false;
         this.alive = true;
        this.type = "badguy";
        
        //this.renderable.addAnimation("run"), [0, 1, 2];
        //this.renderable.CurrentAnimation("run");
        
        this.body.setVelocity(4, 6);

        },
        
        
        update: function(delta){
            this.body.update(delta);
            me.collision.check(this,true, this.collideHandler.bind(this),true);
            
            if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
                }
                this.flipX(!this.walkLeft);
                this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.trick : this.body.accel.x * me.timer.trick;
                
            }else{
                me.game.world.removeChild(this);
            }
            this._super(me.Entity,"update",[delta]);
            return true;
        },
        collideHandler: function(){
            
        }
        
        });
        game.Mushroom = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "mushroom",
                spritewidth: "64",
                spriteheight: "64",
                width: 60,
                height: 28,
                getShape: function() {
                    return (new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);
        me.collision.check(this);
        this.type = "mushroom";
    }
});