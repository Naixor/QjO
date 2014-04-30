	
function OperaMask(div , imd){
			var container = div , imdata = imd, refresher;

			var laugh_audio, angry_audio;

			var cover, cover_ctx, camera, mask, scene, renderer;

			var mouseX = 0, mouseY = 0;
			
			var transform_counter = 100;
			
			var vertices_list = [];
			var current_vertices, target_vertices;
			var next_vertices = [], delta_vertices = [], modified_index = [], next_list = [];
			var origin_geometry;
			var origin_loader, smile_loader, sad_loader, angry_loader;
			var ismaking = false;

			//stats -> true: out , false: in
			var ispressed = false, beat_counter = 0, pre_stats, start_time;
			//current_face -> 1: origin , 2: angry , 3: sad , 4: smile
			var current_face;

			var wiggle_list = [], iscaling = false, current_angle = 0, max_angle = Math.PI/18;

			this.delete_mask = function(){
				cancelAnimationFrame(refresher);
				container.removeChild(container.firstChild);

				laugh_audio.pause();
				angry_audio.pause();

				refresher =null;

				camera = mask = scene = renderer = null;

			
				vertices_list = null;
				current_vertices = target_vertices = null;
				next_vertices =  delta_vertices =  modified_index = next_list = null;
				origin_loader = smile_loader = sad_loader = angry_loader = null;
				wiggle_list = null;
				mask_texture = null;
			}
			var mask_texture = load_texture();

			init_audio();
			init();
			animate();
			
			function init_audio(){
				laugh_audio = window.parent.document.getElementById("laugh");
				angry_audio = window.parent.document.getElementById("angry");;
			}
	
			function load_texture(){

				for(var local_index = 0; local_index<imdata.data.length;local_index+=4){
					if(imdata.data[local_index+3]<180){
						imdata.data[local_index]=238;
						imdata.data[local_index+1]=217;
						imdata.data[local_index+2]=173;
						imdata.data[local_index+3]=255;
					}
				}

				var local_canvas = document.createElement("canvas");
				local_canvas.width = imdata.width;
				local_canvas.height = imdata.height;
				var local_context = local_canvas.getContext('2d');
				local_context.clearRect(0,0,local_canvas.width,local_canvas.height);
				local_context.putImageData(imdata,0,0);
				var texture =new THREE.Texture(local_canvas);
				texture.needsUpdate = true;
				return texture;
			}

			function mask_update(geometry, new_vertices){
				geometry.vertices.length = 0;
				geometry.vertices =new_vertices;
				
			}

			function computeUvs(geometry,loader){
				for(var uv_index = 0; uv_index < loader.vertexIndex.length; uv_index+=3){
					var uv1 = new THREE.Vector2( (loader.vertices[loader.vertexIndex[uv_index]].x+18.7322)/42+0.05, (loader.vertices[loader.vertexIndex[uv_index]].y-15)/58 );
					var uv2 = new THREE.Vector2( (loader.vertices[loader.vertexIndex[uv_index+1]].x+18.7322)/42+0.05, (loader.vertices[loader.vertexIndex[uv_index+1]].y-15)/58 );
					var uv3 = new THREE.Vector2( (loader.vertices[loader.vertexIndex[uv_index+2]].x+18.7322)/42+0.05, (loader.vertices[loader.vertexIndex[uv_index+2]].y-15)/58 );
					geometry.faceVertexUvs[ 0 ].push( [
						uv1,
						uv2,
						uv3
					] );
				}
			}
			
			function generate_cover(){
				cover_ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
				
				var grd=cover_ctx.createRadialGradient(window.innerWidth/2,window.innerHeight/2,0,window.innerWidth/2,window.innerHeight/2,window.innerWidth);
				grd.addColorStop(0,"rgba(255,255,255,0)");
				grd.addColorStop(transform_counter/60,"rgba(255,255,255,0)");
				grd.addColorStop(1,"rgba(255,255,255,1)");
				cover_ctx.fillStyle = grd;
				cover_ctx.arc(window.innerWidth/2,window.innerHeight/2,window.innerWidth,0,2*Math.PI);
				cover_ctx.fill();
				
			}
			
			function transform(){
					renderer.render( scene, camera );
					mask.position.z += 0.5;
					mask.geometry.verticesNeedUpdate = true;
					generate_cover();
					
					transform_counter++;

			}

			function copy_vertices(in_vertices){
				
				var vl =[];

				for(var local_i = 0; local_i<in_vertices.length; local_i++){
					vl.push(new THREE.Vector3(in_vertices[local_i].x,in_vertices[local_i].y,in_vertices[local_i].z));
				}
				return vl;
			}

			function wiggle(dir){
				iscaling = true;
				wiggle_list.length = 0;
				var local_counter, delta_angle;
				if(dir){
					delta_angle = (max_angle - current_angle)/5;
					for(local_counter = 0; local_counter < 5; local_counter++)
						wiggle_list.push(current_angle+=delta_angle);
				
					for(local_counter = 0; local_counter < 10; local_counter++)
						wiggle_list.push(current_angle-=max_angle/10);
				}else{
					delta_angle = (-max_angle - current_angle)/5;
					for(local_counter = 0; local_counter < 5; local_counter++)
						wiggle_list.push(current_angle+=delta_angle);
				
					for(local_counter = 0; local_counter < 10; local_counter++)
						wiggle_list.push(current_angle-=(-max_angle/10));
				}
				iscaling = false;
			}


			function init() {
			
				cover = document.getElementById("cover")
				cover_ctx = cover.getContext("2d");
				cover_ctx.fillStyle = "rgba(255,255,255,1)"
				cover_ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
				

				
				cover.addEventListener('mousedown', function(e){
					e.preventDefault();

					if(e.clientX<529 || e.clientX>843||e.clientY<48||e.clientY>569){
						pre_stats = true;
					}
					else pre_stats = false;

					start_time = new Date().getTime();
					ispressed = true;
				},false);

				cover.addEventListener('mousemove', function(e){
					e.preventDefault();
					if(ispressed){
						if(e.clientX<529 || e.clientX>843||e.clientY<48||e.clientY>569){
							if(!pre_stats)pre_stats = true;
						}else{
							if(pre_stats){
								if(beat_counter<3 && current_face != 3 && current_face != 2){
									vertices_list.push(copy_vertices(sad_loader.vertices));
									current_face = 3;
								}else if(beat_counter>=3 && current_face != 2){
									vertices_list.push(copy_vertices(angry_loader.vertices));
									current_face = 2;
									angry_audio.currentTime = 0;
									angry_audio.play();
								}
								if(e.clientX<683)wiggle(true);
								else wiggle(false);
								laugh_audio.pause();
								pre_stats = false;
								beat_counter++;
								start_time = new Date().getTime();
							}else{
								var elapse = new Date().getTime() - start_time;
								if(elapse>700 && elapse<1200){
									if(current_face!=1 && current_face!=4){
										vertices_list.push(copy_vertices(origin_loader.vertices));
										current_face = 1;
										angry_audio.pause();
									}
									beat_counter = 0;
								}
								else if(elapse>=1200 && current_face!=4){
										vertices_list.push(copy_vertices(smile_loader.vertices));
										current_face = 4;
										angry_audio.pause();
										laugh_audio.currentTime = 0;
										laugh_audio.play();
								}
							}
						}
					}
				},false);

				cover.addEventListener('mouseup', function(e){
					e.preventDefault();
					ispressed = false;
				},false);

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = 100;

				// scene

				scene = new THREE.Scene();

				var ambient = new THREE.AmbientLight( 0x555555 );
				scene.add( ambient );
				scene.fog = new THREE.Fog( 0x59472b , 0 , 400);

				var directionalLight = new THREE.DirectionalLight( 0xffffff );
				directionalLight.position.set( 0, 0, 1 );
				scene.add( directionalLight );
				
				camera.lookAt( scene.position );
				

				var m_bg = new THREE.Mesh(new THREE.PlaneGeometry(200,83),new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture( "/face_models/bgM.png" )}));
				scene.add(m_bg);
				
				

				var manager = new THREE.LoadingManager();
				manager.onProgress = function ( item, loaded, total ) {

					console.log( item, loaded, total );

				};

				var path = "/face_models/";
				var format = '.jpg';
				var urls = [
					path + 'px' + format, path + 'nx' + format,
					path + 'py' + format, path + 'ny' + format,
					path + 'pz' + format, path + 'nz' + format
				];
				
				reflectionCube = THREE.ImageUtils.loadTextureCube( urls );

				// model


				origin_loader = new THREE.OBJLoader( manager );
				origin_loader.load( '/face_models/OriginHead.obj', function ( object ) {

					object.traverse( function ( child ) {
						
						if ( child instanceof THREE.Mesh ) {
							origin_geometry = child.geometry.clone();
							computeUvs(origin_geometry, origin_loader);	
							var material = new THREE.MeshLambertMaterial( { color: 0xeeb0ad, map: mask_texture, envMap: reflectionCube, combine: THREE.AddOperation, reflectivity: 0.3} );
							mask = new THREE.Mesh(origin_geometry, material);
							mask.position.y = - 40;
							mask.position.z = -30;
							scene.add(mask);
							transform_counter = 0;
							current_vertices = copy_vertices(origin_loader.vertices);

							current_face = 1;
						}

					} );
					

				} );
				
				
				
				angry_loader = new THREE.OBJLoader( manager );
				angry_loader.load( '/face_models/AngryHead.obj', function ( object ) {});

				sad_loader = new THREE.OBJLoader( manager );
				sad_loader.load( '/face_models/SadHead.obj', function ( object ) {});

				smile_loader = new THREE.OBJLoader( manager );
				smile_loader.load( '/face_models/SmileHead.obj', function ( object ) {});

				//

				renderer = new THREE.WebGLRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );
				


				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {


				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}


			//

			function animate() {

				refresher = requestAnimationFrame( animate );
				if(transform_counter < 60)transform();
				else render();

			}

			function render() {
				var counter, gap;
				if(vertices_list[0] && !ismaking){
					ismaking = true;
					target_vertices = vertices_list.shift();
					for(counter = 0; counter < target_vertices.length; counter++){
						if(target_vertices[counter].x != current_vertices[counter].x || target_vertices[counter].y != current_vertices[counter].y || target_vertices[counter].z != current_vertices[counter].z){
							delta_vertices.push(new THREE.Vector3((target_vertices[counter].x-current_vertices[counter].x)/6, (target_vertices[counter].y-current_vertices[counter].y)/6, (target_vertices[counter].z-current_vertices[counter].z)/6));
							modified_index.push(counter);
						}
					}
					
					next_vertices = current_vertices.concat();
					
					for( gap = 0; gap < 6; gap++){
						
						for(counter = 0; counter < modified_index.length ; counter++){
							next_vertices[modified_index[counter]].x += delta_vertices[counter].x;
							next_vertices[modified_index[counter]].y += delta_vertices[counter].y;
							next_vertices[modified_index[counter]].z += delta_vertices[counter].z;
						}
						var list_elem = [];
						for(counter = 0; counter < origin_loader.vertexIndex.length ; counter++){
							list_elem.push(new THREE.Vector3());
							list_elem[counter].copy(next_vertices[origin_loader.vertexIndex[counter]]);
						}
						next_list.push(list_elem);
					}
					delta_vertices.length = 0;
					modified_index.length = 0;
					current_vertices = target_vertices;

					ismaking = false;
				}				
				
				if(next_list[0] && !ismaking){

					
						
					mask_update(mask.geometry, next_list.shift());
						
					mask.geometry.verticesNeedUpdate = true;
					
				}
				if(wiggle_list[0] && !iscaling){
					current_angle = wiggle_list.shift();
					mask.rotation.y = current_angle;
					mask.geometry.verticesNeedUpdate = true;
				}

				renderer.setClearColor( scene.fog.color, 1);
				renderer.render( scene, camera );

			}
		}
	