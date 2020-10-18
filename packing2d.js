var binpacking = (function(){

    var outwardStep = 0.1; //variable to move currect rect out by to check for collision avoidance
    var radialStep = 3; //variable to turn in the circular patter to avoid collision with curent rect list
    
    /**
     * Packs rects within area and returns new list with rects in correct
     * location, may remove some rects.
     * 
     * @param area Rect: Area to pack rects within
     * @param rects [Rect]: List of rects sorted in order of importance
     * @param maxDistance: Size to distance ratio for rect to be from center
     * @return Non-overlapping packed rects
     **/
    function pack(area, rects, maxDistance){
        var finalRects = []; //variable to hold position of all words on the final canvas
        var unplaced = 0;
        for (var i = 0;i < rects.length;i++){
            var currenRect = placeRect(rects[i], finalRects, area, maxDistance); //variable to store current rect
            if (currenRect == null){
                // Rect could not be placed
                unplaced++;
            }else{
                finalRects.push(currenRect);
            }
        }
        console.log(unplaced + " rects could not be placed");
        return finalRects;
    }

    /**
     * Return a newly placed rect given a list of existing rects and the
     * area to place the rect within.
     *
     * @param rect Rect: A Rect to be placed in the area
     * @param finalRects [Rect]: List of Rects that could be collided with
     * @param area Rect: Area to place rect within
     * @param maxdist num: Max distance/size ratio that the rect can be placed
     * @return Rect: The place rect (not same object as rect parameter)
     **/
    function placeRect(rect, finalRects, area, maxdist){

        // First check that rect is in the area and there is collision at the
        // original location of the rect
        if (doesRectfit(rect, area) && !checkCollisions(rect, finalRects)){
            // Nothing there! Just place the rect
            //return rect.clone();
            return rect;
        }

        // There was a collision at the rects center location, so
        // we'll check in a circle around the rect with an expanding
        // radius until we're too far away
        var maxDistance = maxdist * rect.size;
        var rotateby = Math.random() * 180;
        var newRect = rect.clone(); //variable to hold the current rect to the final rects dict
        newRect.originalx = rect.x;
        newRect.originaly = rect.y;

        for (var currentRadius = rect.size * outwardStep;
             currentRadius < maxDistance;
             currentRadius += rect.size * outwardStep){
            for (var rotation = 0; rotation < 360; rotation += radialStep){
                var dx = Math.cos(rotateby + rotation * (Math.PI/180)) * currentRadius;
                var dy = Math.sin(rotateby + rotation * (Math.PI/180)) * currentRadius;
                newRect.x = rect.x + dx;
                newRect.y = rect.y + dy;
                newRect.calculateBounds(false);
                if (doesRectfit(newRect, area) && !checkCollisions(newRect, finalRects)){
                    return newRect;
                }

            }
        }


        return null;
    }

    /**
     * Checks collision of rect against a list of Rects
     * 
     * @param rect Rect: Rect to check collisions against
     * @param finalRects [Rect]: Rects to check collision
     * @return: True if collision, false otherwise
     **/
    function checkCollisions(rect, finalRects){
        for (var i = 0; i < finalRects.length; i++){
            var currenRect = finalRects[i];
            if (!(
                    currenRect.left   > rect.right  ||
                    currenRect.right  < rect.left   ||
                    currenRect.top    > rect.bottom ||
                    currenRect.bottom < rect.top

                )) return true;
        }
        return false;
    }

    /**
     * Check that rect is completely within area
     * 
     * @param rect Rect: Rect to check within area
     * @param area Rect: Area to check that rect is within
     * @return: True if completely within area, else false
     **/
    function doesRectfit(rect, area){
        return rect.left > area.left &&
               rect.right < area.right &&
               rect.top > area.top &&
               rect.bottom < area.bottom;
    }

    /**
     * Returns a Rect object that can be used for packing.
     * Call with new! ex) new Rect(0,0,100,120);
     * 
     * @param centerx, centery: Center of Rect
     * @param width,height: Size of Rect
     * @param properties: OPTIONAL Object w/ properties
     * @return Rect object to be used for packing
     **/
    function Rect(centerx, centery, width, height, properties){
        this.x = centerx;
        this.y = centery;
        this.width = width;
        this.height = height;
        this.properties = properties || {};
        this.calculateBounds();
    }

    /**
     * Calculates bounds of rectangle (call after changing x/y/width/height)
     *
     * @param recalculateSize bool: OPTIONAL if set to false, size will not be
     *                              recalculated
     **/
    Rect.prototype.calculateBounds = function(recalculateSize){
        this.left = this.x - this.width/2;
        //this.right = this.x + this.width/2;
        this.right = this.x +this.width/2;
        this.top = this.y - this.height/2;
        this.bottom = this.y + this.height/2;
        if (recalculateSize !== false){
            this.size = Math.sqrt(this.width * this.width + this.height * this.height);
        }
    }

    /**
     * Draws Rect to canvas.
     *
     * @param context CanvasRenderingContext2d: Context to draw to
     **/
    Rect.prototype.draw = function(context){
        context.save();
        context.strokeStyle = "#f00";
        context.lineWidth = 2;
        context.strokeRect(
            this.x - this.width/2,
            this.y - this.height/2,
            this.width, this.height);
        if (this.originalx !== undefined && this.originaly !== undefined){
            context.globalAlpha = .2;
            context.beginPath();
            context.moveTo(this.originalx, this.originaly);
            context.lineTo(this.x, this.y);
            //context.translate(this.x,this.y);
           // context.rotate(-Math.PI/4);
            context.closePath();
            context.stroke();
            
        }
        context.restore();
    }

    /**
     * Creates new Rect from existing Rect, note that properties is not deep
     * copied
     **/
    Rect.prototype.clone = function(){
        return new Rect(this.x, this.y, this.width, this.height, this.properties);
    };

    /**
     * Adds property to Rect object (often font size or text value)
     *
     * @param propName String: Property name
     * @param propValue: Property value
     **/
    Rect.prototype.addProperty = function(propName, propValue){
        this.properties[propName] = propValue;
    };

    /**
     * Returns a previously stored property
     **/
    Rect.prototype.getProperty = function(propName){
        return this.properties[propName];
    }


    return {

        // Public Methods

        pack: pack,
        Rect: Rect,

        setoutwardStep: function(v){ outwardStep = v; },
        setRadialStep: function(v){ radialStep = v; }

    };
})();