game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // reset the score
        game.data.score = 0;
//helps get into the next level of mario and tells it when the level goes
        me.levelDirector.loadLevel("level04");
//how big mario is suppose to be or anything else
        var player = me.pool.pull("mario", 0, 420, {});
        me.game.world.addChild(player, 3);
//helps mario moves 
        me.input.bindKey(me.input.KEY.RIGHT, "right");

        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },
    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});