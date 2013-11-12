

this.width = 1000;
this.height = 1000;
this.segments = 128;
this.smoothingFactor  = 100;
this.river_canvas;

function getRandomInt(min, max)
{
    if (!max){
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



this.diamondSquare = function() {
        this.terrain = new Array();

        for(var i = 0; i <= this.segments; i++) {
            this.terrain[i] = new Array();
            for(var j = 0; j <= this.segments; j++) {
                this.terrain[i][j] = 0;//getRandomInt(-30,170);
            }
        }

		var size = this.segments+1;
		for(var length = this.segments; length >= 2; length = length /2) {
			var half = length/2;
			this.smoothingFactor /= 2;

			// generate the new square values
			for(var x = 0; x < this.segments; x += length) {
				for(var y = 0; y < this.segments; y += length) {
					var average = this.terrain[x][y]+ // top left
					this.terrain[x+length][y]+ // top right
					this.terrain[x][y+length]+ // lower left
					this.terrain[x+length][y+length]; // lower right
					average /= 4;
					average += 2*this.smoothingFactor*Math.random()-this.smoothingFactor;
                    try {
					this.terrain[x+half][y+half] = average;
					} catch(e){
					    alert(x+half);
					}
				}
			}

			// generate the diamond values
			for(var x = 0; x < this.segments; x += half) {
				for(var y = (x+half)%length; y < this.segments; y += length) {
					var average = this.terrain[(x-half+size)%size][y]+ // middle left
							this.terrain[(x+half-10)%size+10][y]+ // middle right
							this.terrain[x][(y+half)%size]+ // middle top
							this.terrain[x][(y-half+size)%size]; // middle bottom
					average /= 4;
					average += 2*this.smoothingFactor*Math.random()-this.smoothingFactor;

					this.terrain[x][y] = average;

					// values on the top and right edges
					if(x === 0)
						this.terrain[this.segments][y] = average;
					if(y === 0)
						this.terrain[x][this.segments] = average;
				}
			}
		}
		this.segments +=1
		return this.terrain;
	};





function generateMap() {

    //scene = new THREE.Scene();


    this.terrain = diamondSquare();

    this.geometry = new THREE.PlaneGeometry(
        this.width,
        this.height,
        this.segments,
        this.segments
    );
    var index = 0;
    for(var i = 0; i < this.segments; i++) {
        for(var j = 0; j < this.segments; j++) {
                this.geometry.vertices[j*this.segments + i].setZ(this.terrain[i][j]);
                index++;
        }
    }

    this.texture = 'images/textures/grass.jpg';
    //material = new THREE.MeshBasicMaterial( { color: 0x003300, wireframe: true  } );
    this.material = this.material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(this.texture)
    });
    mesh = new THREE.Mesh( geometry, material );
    mesh = generateRiver(mesh);
    mesh.rotation.x -= 3.1415/2;
    return mesh;
}





function generateRiver(  map_mesh){
    this.river_canvas =  document.createElement("canvas");
    this.river_canvas.width = this.width;
    this.river_canvas.height = this.height;

    canvas = this.river_canvas.getContext("2d");
    canvas.strokeStyle = "red";
    canvas.lineWidth=this.width/10|0;
    canvas.beginPath();
    canvas.moveTo(0,0);
    canvas.bezierCurveTo(getRandomInt(100,2000),getRandomInt(100,200),getRandomInt(100,200),
        getRandomInt(100,2000),this.width,this.height);
    canvas.stroke();

    canvasImageData = canvas.getImageData(0, 0, this.width, this.height);
    for (var i=0; i < map_mesh.geometry.vertices.length; i++) {
        i_x = map_mesh.geometry.vertices[i].x + this.width/2|0;
        i_y = map_mesh.geometry.vertices[i].y + this.height/2|0;
        index = (i_x + i_y * canvasImageData.width) * 4;
        if (canvasImageData.data[index] > 10 )
            map_mesh.geometry.vertices[i].setZ(-200);
    }
    map_mesh.geometry.dynamic = true;
    map_mesh.geometry.verticesNeedUpdate = true;
    return map_mesh;
}
