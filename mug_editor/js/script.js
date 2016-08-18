var selectedLayer;
var selectedLayerIndex;
var selectedProduct, selectedType;
var selectedView;
var selectedStage;
var rendering = true;
var canvasViews;
var allActiveTextures;
var allWorkplaces;
var frameId;
var reflectionCube, active_texture, GUI_panel;
var cup_mat, decal_mat, inside_mat, decal_mat2;
var rotateSlider, sizeSlider;

window.onload = function(){
        var script=document.createElement('script');
        script.onload=function(){
            var stats=new Stats();
            document.body.appendChild(stats.dom);
            requestAnimationFrame(function loop(){
                stats.update();
                requestAnimationFrame(loop)
            });
        };
        script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
        document.head.appendChild(script);


    selectedProduct = getUrlParameter('product');
    if(selectedProduct === undefined) {
        selectedProduct = 'cup';
    }

    if(selectedProduct== 'cup') {
        selectedType = getUrlParameter('type');
    }
	rotateSlider = $("#rotate").slider();
	sizeSlider = $("#size").slider();
	
	var opened = true;
	$("#close_preview").click(function() {
		$("#preview_area").toggleClass('hidden_div');
		$(".left_header").toggleClass('hidden_buttons');
        $("#tabs_toolbar").toggleClass('hidden_buttons');
		if(opened) {
			$("#close_preview i").removeClass();
			$("#close_preview i").addClass('icon-arrow-up');
            $("#close_button").text("upraviť");
			opened = false;
		} else {
			$("#close_preview i").removeClass();
			$("#close_preview i").addClass('icon-icon_cancel');
            $("#close_button").text("skryť");
			opened = true;
		}
	});

	var sidebar_opened = true;
	$("#sidebar_header").click(function() {
		$("#sortable").toggleClass('layers_hidden');
		$("#sidebar_header").toggleClass('header_hidden');

		if(sidebar_opened) {
			$("#show_sidebar i").removeClass();
			$("#show_sidebar i").addClass('icon-arrow-left');
			sidebar_opened = false;
		} else {
			$("#show_sidebar i").removeClass();
			$("#show_sidebar i").addClass('icon-arrow-right');
			sidebar_opened = true;
		}
	});

	$(".button_close").click(function() {
		hidePopups();
	});

	$("#insert_image").click(function() {
		$("#popup_text").hide();
		$("#popup_wrapper").show();
		$("#popup_image").show();
	})

	$("#insert_text").click(function() {
		showTextPopup(defaultTextHeading);
	})

    $("#file_up").click(function() {
        $("#file_upload").click();
    });

    document.getElementById("file_upload").addEventListener('change', handleFileSelect, false);
    
	initializePreview();

    init();
    animate();

    if(selectedProduct != 'cup') {
        camera.position.setZ(noCupCameraZ);
    }

    $("#download_file").click(function(evt) {
        exportFile("subor.json");
    })
}
function hidePopups() {
	$("#popup_wrapper").hide();
	$("#popup_image").hide();
	$("#popup_text").hide();
}

function initializePreview() {
	$("#save_button").click(function() {
        handleTextAdd();
        hidePopups();
    });

    $("#alignment_left").click(function() {
        $("#new_text").css("text-align","left");
        $(".text_alignment").removeClass("active");
        $(this).addClass("active");
    });

    $("#alignment_center").click(function() {
        $("#new_text").css("text-align","center");
        $(".text_alignment").removeClass("active");
        $(this).addClass("active");
    });

    $("#alignment_right").click(function() {
        $("#new_text").css("text-align","right");
        $(".text_alignment").removeClass("active");
        $(this).addClass("active");
    });

    $("#font_type").change(function() {
    	$("#new_text").css("font-family",$(this).val());
    });

    $("#font_color").change(function() {
    	$("#new_text").css("color",$(this).val());
    });
}

function handleFileSelect(evt) {
    var filename = this.value.split("\\").pop();
    $("#show_upload_text").hide();
    $("#show_loading").show();
    var URL = window.webkitURL || window.URL;
    var url = URL.createObjectURL(evt.target.files[0]);
    myurl = url;
    myfilename = filename;
    if (url != null) {
        createLayer(0, 0, url, filename, false, false);
        crrdecal = decalTextures.length - 1;
        selectedMaterial.map = decalTextures[crrdecal];
        $("#show_upload_text").show();
        $("#show_loading").hide();
        hidePopups();
    }

    var file = this.files[0]

    var img = new Image();

    img.src = window.URL.createObjectURL( file );

    img.onload = function() {
        var width = img.naturalWidth,
            height = img.naturalHeight;
        alert(width + " a " + height)
    };
}

function handleTextAdd() {
    createLayer(0,0,"","",true, false);
}

function showTextPopup(header, font, align, color, text) {
	hidePopups();

	$("#popup_text_header").html(header);

	$("#font_type").empty();
    var font_sel = false;

	for(var i in textFonts) {
		$('#font_type').append($('<option>', {
		    value: textFonts[i],
		    text: textFonts[i],
		}));
	}

    if(font !== undefined) {
        $('#font_type option[value='+font+']').attr('selected','selected');
        $("#new_text").css("font-family",font);
    } else {
		$("#new_text").css("font-family",defaultTextFont);
    }

	$(".text_alignment").removeClass("active");

	if(align === "right") {
		$("#alignment_right").addClass("active");
		$("#new_text").css("text-align","right");
	} else if(align === "center") {
		$("#alignment_center").addClass("active");
		$("#new_text").css("text-align","center");
	} else {
		$("#alignment_left").addClass("active");
		$("#new_text").css("text-align","left");
	}
	
	if(color !== undefined) {
		color = rgbToHex(color);
	}

	if(color === undefined) {
		$("#font_color").val(defaultTextColor);
		$("#new_text").css("color",defaultTextColor);
	} else {
		$("#font_color").val(color);
		$("#new_text").css("color",color);
	}

	$("#new_text").val(text);

    if(text !== undefined) {
        var item = workplace.children[selectedLayerIndex];
        $("#save_button")
            .unbind()
            .click(function() {
                item.changeText();
                hidePopups();
        });
    } else {
        $("#save_button")
            .unbind()
            .click(function() {
                handleTextAdd();
                hidePopups();
        });
    }

	$("#popup_image").hide();
	$("#popup_wrapper").show();
	$("#popup_text").show();
}
function initCanvas() {
    canvasViews = new Array();

    var $toolbar = $("#tabs_toolbar");
    $toolbar.empty();

    var $safe_zone = $("<div/>", {
        "id":"safe_zone",
        "html":$("<div/>")
    });

    $("#preview_area").append($safe_zone);
    //preview for view layout

    $.each(preview_attributes[selectedProduct],function(index,value) {

        var new_workplace = new PIXI.Container();
        new_workplace.position.x = 0;
        new_workplace.position.y = 0;
        new_workplace.width = value.printAreaSize.width;
        new_workplace.height = value.printAreaSize.height;
        new_workplace.setHeight = value.printAreaSize.height;
        new_workplace.setWidth = value.printAreaSize.width;
        new_workplace.hiddenName = value.name;
        new_workplace.backgroundChild = undefined;


        var div_view_canvas = new PIXI.WebGLRenderer(value.printAreaSize.width, value.printAreaSize.height, { transparent: true, antialiasing: false });
        document.getElementById('preview_area').appendChild(div_view_canvas.view);
        div_view_canvas.view.setAttribute("id","preview_"+index);
        div_view_canvas.view.setAttribute("class","preview");
        

        if(index>0) {
            $("#preview_"+index).hide();
        }
        
        var $controls = 
        $("<div/>", {
            "class": "tab",
            "html": value.name,
            "click": function(e) {
                cancelAnimationFrame(frameId);

                $(".tab").removeClass("active");
                $(this).addClass("active");
                $(".preview").hide();
                $("#preview_"+index).show();
                $(".preview_div").css("width",value.css.width);
                $("#preview_area").css("height",value.css.height);

                selectedMaterial = materials_2d_preview[index];
                selectedStage = index;
                decalTextures[0] =  allActiveTextures[index];
                workplace = stages[selectedStage];
                selectedView = index;

                animate();

                rebuildList();
            }
        });

        if(index == 0) {
            $controls.addClass("active");
            $(".preview_div").css("width",value.css.width);
                $("#preview_area").css("height",value.css.height);
        }

        $toolbar.append($controls);

        canvasViews.push(div_view_canvas);
        stages.push(new_workplace);
    });

    selectedView = 0;
    selectedStage = 0;
    workplace = stages[selectedStage];
}

function initTexture() {
    texture = PIXI.Texture.fromImage(firstLogo);

    var width = preview_attributes[selectedProduct][selectedView].printAreaSize.width;
    var height = preview_attributes[selectedProduct][selectedView].printAreaSize.height;

    createLayer(Math.random() * width,
                Math.random() * height, 
                "",
                "", 
                false,
                false);
}

function initControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.target = new THREE.Vector3(0, 0, 0);
    controls.smooth = true;
    controls.smoothspeed = 0.8;
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1100);
    camera.position.z = 100;
}

function initLights() {
    var ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ precision: 'highp', antialias: false,alpha: false });
    renderer.setSize(window.innerWidth/1.2, window.innerHeight/1.2);
    renderer.setClearColor(0xeeeeee, 0.5);
    container.appendChild(renderer.domElement);
}

function initMaterials() {
    cup_mat = new THREE.MeshPhongMaterial({ 
        map: default_texture, 
        color: 0xFFFFFF, 
        doubleSided: true,
        ambient: 0xFFFFFF, 
        shading: THREE.SmoothShading, 
        envMap: reflectionCube, 
        combine: THREE.MixOperation, 
        reflectivity: 0.2, 
        emissive: 0x222222 
    });
    
    decal_mat = new THREE.MeshPhongMaterial({ 
        map: default_texture, 
        color: 0xFFFFFF, 
        doubleSided: true,
        ambient: 0x000000, 
        shading: THREE.SmoothShading, 
        envMap: reflectionCube, 
        combine: THREE.MixOperation, 
        reflectivity: 0.2, 
        emissive: 0x222222 
    });

    inside_mat = new THREE.MeshPhongMaterial({ 
        map: default_texture, 
        doubleSided: true,
        color: 0xFFFFFF, 
        ambient: 0xFFFFFF, 
        transparent: true,
        shading: THREE.SmoothShading, 
        envMap: reflectionCube, 
        combine: THREE.MixOperation, 
        reflectivity: 0.2, 
        emissive: 0x222222 
    });

    if(selectedProduct == 'cup') {
        decal_mat2 = new THREE.MeshLambertMaterial({
            map: decalTextures[0],
            doubleSided: true,
            color: 0xFFFFFF,
            ambient: 0xeeeeee,
            shading: THREE.SmoothShading,
            envMap: reflectionCube,
            combine: THREE.MixOperation,
            reflectivity: 0.2,
            transparent: true,
            emissive: 0x222222
        });

        selectedMaterial = decal_mat2;
    } else {
        materials_2d = new Array();
        materials_2d_preview = new Array();
        materials_shadows = new Array();

        $.each(preview_attributes[selectedProduct],function(index,value) {
            var new_material = new THREE.MeshPhongMaterial({
                map:THREE.ImageUtils.loadTexture(value.texture.src),
                transparent: true
            });

            new_material.map.needsUpdate = true;

            new_material.requestPosition = {
                x: value.texture.position.x,
                y: value.texture.position.y
            };

            new_material.requestSize = {
                width: value.texture.size.width,
                height: value.texture.size.height
            };

            var new_layout_material = new THREE.MeshPhongMaterial({
                //transparent: true,
                map: canvasViews[index].view
            });
            new_material.shadow = false;

            materials_2d.push(new_material);

            if(value.texture.shadow !== undefined) {
                other_material = new THREE.MeshPhongMaterial({
                    map:THREE.ImageUtils.loadTexture(value.texture.shadow),
                    transparent: true
                });

                other_material.requestPosition = {
                    x: value.texture.position.x,
                    y: value.texture.position.y
                };

                other_material.requestSize = {
                    width: value.texture.size.width,
                    height: value.texture.size.height
                };

                other_material.shadow = true;
                other_material.shadowScale = value.texture.shadow_scale;
                materials_shadows.push(other_material);
            }

            materials_2d_preview.push(new_layout_material);
        });
        selectedMaterial = materials_2d_preview[0];

    }

    decal_mat.ambient = cup_mat.ambient;
}

function initBackgrounds() {

    $.each(preview_attributes[selectedProduct], function(index, value) {

        if(value.texture.preview !== undefined) {
            selectedMaterial = materials_2d_preview[index];
            selectedStage = index;
            decalTextures[0] =  allActiveTextures[index];
            workplace = stages[selectedStage];
            selectedView = index;

            createLayer(Math.random() *  workplace.width,
                Math.random() *  workplace.height, 
                value.texture.preview,
                "", 
                false,
                true);
        };
    });

}

function init() {
    initCanvas();
    initTexture();
    initReflections();

    allActiveTextures = new Array();
    $.each(canvasViews, function(index,value) {
        var my_active_texture = new THREE.Texture(value.view);
        my_active_texture.needsUpdate = true;

        allActiveTextures.push(my_active_texture)
    });
    
    //default first image
    default_texture = THREE.ImageUtils.loadTexture(defaultCupTexture);
    decalTextures = [
        //THREE.ImageUtils.loadTexture("images/decal2.jpg"),
        allActiveTextures[selectedView]
    ];

    initMaterials();

    container = document.getElementById('main_editor');

    initCamera();

    // scene

    scene = new THREE.Scene();

    initLights();
    // texture

    var texture = new THREE.Texture();

    switch(selectedProduct) {
        case 'cup':
            var loader = new THREE.JSONLoader();

            var mats = [decal_mat, cup_mat, inside_mat];

            var callbackCup = function(geometry, materials) { createScene(geometry, mats, "cup", 0, -20, 0); };
            var callbackDecal = function(geometry, materials) { createScene(geometry, mats, "decal", 0, -20, 0); };

            loader.load("images/cup/cup.blend.json", callbackCup);
            loader.load("images/cup/decal.json", callbackDecal);
            break;
        default:
            $.each(materials_2d, function(index, value) {
                var added_texture = new THREE.Mesh(new THREE.PlaneGeometry(value.requestSize.width, value.requestSize.height),value);
                added_texture.position.setX(value.requestPosition.x);
                added_texture.position.setY(value.requestPosition.y);
                added_texture.overdraw = true;
                scene.add(added_texture);

                var geometry = new THREE.PlaneGeometry(value.requestSize.width, value.requestSize.height); 

                if(preview_attributes[selectedProduct][index].geometry!==undefined) {
                    geometry.dynamic = true; 
                    geometry.verticesNeedUpdate = true;
                    $.each(preview_attributes[selectedProduct][index].geometry, function(index, value) {
                        geometry.vertices[index].x = value.x;    
                        geometry.vertices[index].y = value.y;    
                        geometry.vertices[index].z = value.z;    
                    })
                }

                geometry.computeFaceNormals();

                createScene(geometry, 
                            mats, 
                            "other", 
                            value.requestPosition.x,
                            value.requestPosition.y,
                            index);
            });

            $.each(materials_shadows, function(index, value) {
                var new_geometry = new THREE.PlaneGeometry(value.requestSize.width, value.requestSize.height); 

                new_geometry.dynamic = true; 
                new_geometry.verticesNeedUpdate = true;
                
                var new_texture = new THREE.Mesh(new_geometry,value);
                new_texture.translateZ(400);
                new_texture.scale.set(value.shadowScale, value.shadowScale, value.shadowScale);
                new_texture.position.setX(-value.requestPosition.x);
                new_texture.overdraw = true;
                scene.add(new_texture);
            });
            break;
    }
    
    if(selectedProduct !== 'cup') {
        initBackgrounds();
    }

    initRenderer();
    initControls();

    if(selectedProduct != 'cup') {
        controls.enabled = false;
    }
    window.addEventListener('resize', onWindowResize, false);

    changeColor(cupTextures[selectedType]);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(rgb) {
	if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};

function getRGBobject(rgb) {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return {r:hex(rgb[1]), g:hex(rgb[2]), b:hex(rgb[3])};
};

function changeColor(color_template) {
    if(color_template == "none") {
        new_texture = THREE.ImageUtils.loadTexture(defaultCupTexture);

        inside_mat.map = new_texture;
        decal_mat.map = new_texture;
        cup_mat.map = new_texture;

        inside_mat.transparent = true;
        decal_mat.transparent = true;
        cup_mat.transparent = true;
        inside_mat.opacity = .3;
        decal_mat.opacity = .3;
        cup_mat.opacity = .3;            
    } else {
        new_texture = THREE.ImageUtils.loadTexture(color_template);

        inside_mat.map = new_texture;
        decal_mat.map = new_texture;
        cup_mat.map = new_texture;
        inside_mat.transparent = false;
        decal_mat.transparent = false;
        cup_mat.transparent = false;
        inside_mat.opacity = 1;
        decal_mat.opacity = 1;
        cup_mat.opacity = 1;    
    }
}

function initReflections() {
    var path = "images/reflections/";
    var format = '.jpg';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];

    reflectionCube = THREE.ImageUtils.loadTextureCube(urls);
    reflectionCube.format = THREE.RGBFormat;
}

function getCanvas(textContent, fontSize, font, color, align) {
        var lines = textContent.split("\n");

        var canvas = document.createElement ('canvas');
        var offset = 0.1*fontSize;
        var ctx = canvas.getContext ('2d');
        
        ctx.font = fontSize + "px " + font;
        
        var longestText = "";
        $(lines).each(function() {
            if(this.length > longestText.length)
                longestText = this;
        });

        var canvasWidth = ctx.measureText(longestText).width;
        canvas.width = canvasWidth + (offset*2);
        canvas.height = ((lines.length) * Number(fontSize)) + (offset*2);

        ctx.font = fontSize + "px " + font;
        ctx.fillStyle = color;

        var yAxis = Number(fontSize) + (offset);

        $(lines).each(function() {
            textLength = ctx.measureText(this).width;

            var xAxis = offset;

            if(align == "center") {
                xAxis = ((canvasWidth/2) - (textLength/2)) + offset;
            } else
            if (align == "right") {
                xAxis = canvasWidth - textLength + offset;
            }

            ctx.fillText(this,xAxis,yAxis);
            yAxis+=Number(fontSize);
        });
        
        return canvas;
}

function startRendering() {
    rendering = true;
}

function createLayer(x, y, _url, _filename, is_text, is_background) {
    //return;
    var _scale = 1.5;
    var _texture = texture;
    var bunny;

    //if url is provided that create new texture
    if ((_url !== "")&&(!is_text)) {
        _texture = PIXI.Texture.fromImage(_url);
        _scale = 0.51;
    } 

    if(is_text) {
        var textContent = $("#new_text").val();
        var textFont = $("#new_text").css("font-family");
        var textFontSize = defaultTextSize;
        var textFontColor = $("#new_text").css("color");
        var textAlign = $("#new_text").css("text-align");
        var canvas = getCanvas(textContent, textFontSize, textFont, textFontColor, textAlign);
        
        bunny = new PIXI.Sprite (new PIXI.Texture (new PIXI.BaseTexture (canvas)));

        bunny.textContent = textContent;
        bunny.textFont = textFont;
        bunny.textFontSize = textFontSize;
        bunny.textFontColor = textFontColor;
        bunny.textAlign = textAlign;
        bunny.canvas = canvas;
    }
    else{
        bunny = new PIXI.Sprite(_texture);

        if(is_background) {
            bunny.width = workplace.setWidth;
            bunny.height = workplace.setHeight;
        }

        if(_filename == "") {
            _filename = 'logo.jpg';
        }

        bunny.textFullUrl = _filename;

        if(_filename.length > 10) {
            _filename = _filename.substring(0,10)+'…';
        }
        bunny.textUrl = _filename;
    }

    bunny.isBackground = is_background; 
    bunny.isItem = true;
    bunny.isText = is_text;
    if(!is_background) {
        bunny.interactive = true;
    }

    bunny.buttonMode = true;
    //center axis
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;
    
    //filters
    bunny.hasGray = false;
    bunny.hasSepia = false;
    bunny.hasInvert = false;

    bunny.scaleChange = false;
    bunny.scaleSize = 1;

    // make it a bit bigger, so its easier to touch
    //bunny.scale.x = bunny.scale.y = _scale;


    bunny.hasControls = false;

    bunny.initWidth = 0;
    bunny.initHeight = 0;

    bunny.id = layerId++;
    selectedLayer = bunny.id;

    bunny.opacityVal = 1;

    bunny.makeOpacity = function(value) {
    	this.alpha = value;
        this.opacityVal = value;
        startRendering();
    }

    bunny.mouseover = function(data) {
        //this.alpha = this.alpha*0.8;
    }

    bunny.mouseout = function(data) {
        //this.alpha = this.alpha/0.8;
    }
    // use the mousedown and touchstart
    bunny.mousedown = bunny.touchstart = function(eventData) {
        var data = eventData.data;
        if(selectedProduct == 'cup')
            controls.enabled = false;
        //delete layer
        data.originalEvent.preventDefault();
        this.data = data;
        this.alpha = this.opacityVal*0.7;
        this.dragging = true;
        if (this.parent) {
            var parent = this.parent;

            parent.removeChild(this);
            parent.addChild(this);

            if(workplace.backgroundChild !== undefined) {
                parent.removeChild(workplace.backgroundChild);
                parent.addChild(workplace.backgroundChild);
            }
        }
        this.startposition = this.data.getLocalPosition(this.parent);

        $("#"+this.id).click();
        startRendering();
    };

    // set the events for when the mouse is released or a touch is released
    bunny.mouseup = bunny.mouseupoutside = bunny.touchend = bunny.touchendoutside = function(eventData) {
        var data = eventData.data;
        this.alpha = this.opacityVal;
        this.dragging = false;
        this.data = null;
        if(selectedProduct == 'cup')
            controls.enabled = true;
     
        startRendering();
        rebuildList();
    };

    // set the callbacks for when the mouse or a touch moves
    bunny.mousemove = bunny.touchmove = function(eventData) {
        var data = eventData.data;
        if (this.dragging) {
            var move_x = this.data.getLocalPosition(this.parent).x - this.startposition.x;
            var move_y = this.data.getLocalPosition(this.parent).y - this.startposition.y;
           
            this.position.x += move_x;
            this.position.y += move_y;

            this.startposition = this.data.getLocalPosition(this.parent);
        }

        startRendering();
    }

    bunny.makeRotate = function(value) {
        this.rotation = value;
        startRendering();
    }

    bunny.makeScale = function(value) {
        if(this.initWidth == 0) {
            this.initWidth = this.texture.baseTexture.width;
        }

        if(this.initHeight == 0) {
            this.initHeight = this.texture.baseTexture.height;
        }

        if(this.isText) {
            this.textFontSize = defaultTextSize * value;
            console.log(this.textFontSize);
            var canvas = getCanvas(this.textContent, this.textFontSize, this.textFont, this.textFontColor, this.textAlign);
        
            var newTexture = new PIXI.BaseTexture (canvas);
        } else {
            var newTexture = this.texture.baseTexture;

            newTexture.width = this.initWidth*value;
            newTexture.height = this.initHeight*value;
        }
        this.texture = new PIXI.Texture(newTexture);

        this.scaleSize = value;
        startRendering();
    }

    bunny.changeSize = function(width, height) {
        if(this.initWidth == 0) {
            this.initWidth = this.texture.baseTexture.width;
        }

        if(this.initHeight == 0) {
            this.initHeight = this.texture.baseTexture.height;
        }

        var newTexture = this.texture.baseTexture;

        newTexture.width = width;
        newTexture.height = height;

        this.texture = new PIXI.Texture(newTexture);
        startRendering();
    }

    bunny.rotate = function() {
        if (this.rotating) {
            var element = this.parent;

            element.dragging = false;

            var A = {   x: element.position.x,
                        y: element.position.y};

            var B = {   x: x,
                        y: y};

            var C = {   x: x_drag,
                        y: y_drag};

            var a = Math.sqrt(Math.pow((C.x-B.x),2)+Math.pow((B.y-C.y),2));
            var b = Math.sqrt(Math.pow((A.x-C.x),2)+Math.pow((C.y-A.y),2));
            var c = Math.sqrt(Math.pow((B.x-A.x),2)+Math.pow((A.y-B.y),2));

            var v1 = {x: B.x-A.x, y:B.y-A.y};
            var v2 = {x:B.x-C.x, y:B.y-C.y};

            var xp = v1.x*v2.y - v1.y*v2.x;

            var result = ((-Math.pow(a,2)+Math.pow(b,2)+Math.pow(c,2)))/(2*b*c);
            
            var rotation = Math.acos(result);

            if(xp<0) {
                rotation = Math.PI + (Math.PI-rotation);
            }

            element.rotation = -rotation;
        }
        startRendering();
    }

    // move the sprite to its designated position
    bunny.position.x = preview_attributes[selectedProduct][selectedView].printAreaSize.width/2;
    bunny.position.y = preview_attributes[selectedProduct][selectedView].printAreaSize.height/2;
    
    bunny.moveCenter = function() {
        this.position.x = preview_attributes[selectedProduct][selectedView].printAreaSize.width/2;
        this.position.y = preview_attributes[selectedProduct][selectedView].printAreaSize.height/2;
        startRendering();
    }

    bunny.moveLeft = function() {
        this.position.x = this.width/2;
        startRendering();
    }

    bunny.moveRight = function() {
        this.position.x = preview_attributes[selectedProduct][selectedView].printAreaSize.width-(this.width/2);
        startRendering();
    }

    bunny.moveTop = function() {
        this.position.y = this.height/2;
        startRendering();
    }

    bunny.moveBottom = function() {
        this.position.y = preview_attributes[selectedProduct][selectedView].printAreaSize.height-(this.height/2);
        startRendering();
    }

    bunny.makeGray = function() {
        if(this.hasGray)
            this.hasGray = false;
        else
            this.hasGray = true;

        this.setAllFilters();
        startRendering();
    }

    bunny.makeSepia = function() {
        if(this.hasSepia)
            this.hasSepia = false;
        else
            this.hasSepia = true;

        this.setAllFilters();
        startRendering();
    }

    bunny.makeInvert = function() {
        if(this.hasInvert)
            this.hasInvert = false;
        else
            this.hasInvert = true;

        this.setAllFilters();
        startRendering();
    }

    bunny.setAllFilters = function() {
        var gray = new PIXI.filters.GrayFilter();
        var sepia = new PIXI.filters.SepiaFilter();
        var invert = new PIXI.filters.InvertFilter();

        var new_filters = [];

        if(this.hasGray)
            new_filters.push(gray);
        if (this.hasSepia)
            new_filters.push(sepia);
        if(this.hasInvert)
            new_filters.push(invert);

        if(new_filters.length == 0)
            this.filters = null;
        else
            this.filters=new_filters;
        startRendering();
    }

    bunny.flipHorizontaly = function() {
        this.scale.y = -this.scale.y;
        startRendering();
    }

    bunny.flipVerticaly = function() {
        this.scale.x = -this.scale.x;
        startRendering();
    }

    bunny.changeText = function() {
        var textContent = $("#new_text").val();
        var textFont = $("#new_text").css("font-family");
        var textFontSize = defaultTextSize;
        var textFontColor = $("#new_text").css("color");
        var textAlign = $("#new_text").css("text-align");

        var canvas = getCanvas(textContent, textFontSize, textFont, textFontColor, textAlign);
        
        this.texture = new PIXI.Texture(new PIXI.BaseTexture (canvas));

        bunny.textContent = textContent;
        bunny.textFont = textFont;
        bunny.textFontSize = textFontSize;
        bunny.textFontColor = textFontColor;
        bunny.textAlign = textAlign;
        bunny.canvas = canvas;

        startRendering();
        rebuildList();
    }
    // add it to the stage
    workplace.addChild(bunny);
    if(bunny.isBackground) {
        workplace.backgroundChild = bunny;
    }

    if(workplace.backgroundChild !== undefined) {
        workplace.removeChild(workplace.backgroundChild);
        workplace.addChild(workplace.backgroundChild);
    }

    startRendering();
    rebuildList();
}
function createScene(geometry, materials, _model, position_x, position_y, index) {
    if (_model == "cup") {
        geometry.computeVertexNormals();
        zmesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        zmesh.scale.set(0.5, 0.5, 0.5);
        zmesh.position.y = position_y;
        scene.add(zmesh);
    } else if(_model == "decal") {
        geometry.computeVertexNormals();
        zmesh = new THREE.Mesh(geometry, selectedMaterial);
        zmesh.scale.set(0.5, 0.5, 0.5);
        zmesh.position.y = position_y;
        scene.add(zmesh);
    } else {
        geometry.computeVertexNormals();

        materials_2d_preview[index].map = allActiveTextures[index];

        zmesh = new THREE.Mesh(geometry, materials_2d_preview[index]);
        zmesh.scale.set(0.5, 0.5, 0.5);
        zmesh.position.x = position_x;
        zmesh.position.y = position_y;
        zmesh.position.z = 6;
        scene.add(zmesh);
    }

}

function textLayerControlTemplate(item, i){
    var $textControlContent = 
    $("<div/>", {
        "class": "list-group-item",
        "html": 
        $("<div/>", {
            "id": item.id,
        	"class": "description",
        	"html":
        	$("<div/>", {
        		"class": "image_content",
        		"html":
        		$("<img/>", {
        			"src": textIcon,
        			"alt":"Preview"
        		}),
        	}).add(
        	$("<div/>", {
        		"class": "header",
        		"html": item.textContent.substring(0,10)+'…'
        	})
        	).add(
        	$("<div/>", {
    			"class": "tools",
    			"html":
    			$("<div/>", {
    				"class":"opacity",
    				"click": function(e){
                        var closed = $(this)
                                        .closest(".list-group-item")
                                        .find('.specials .opacity')
                                        .hasClass('hidden_special');

                        $('.specials .opacity')
                            .addClass('hidden_special');
                        $('.specials .effects')
                            .addClass('hidden_special');
    					
                        if(closed) {
                            $(this)
                                .closest(".list-group-item")
                                .find('.specials .opacity')
                                .removeClass('hidden_special');
                        }
						},
    				"html":
    				$("<span/>", {
    					"id":"opacity_"+item.id,
    					"html":(item.alpha*100)
    				}).add(
    				$("<span/>", {
    					"html":"%"
    				}))
    			}).add(
    			$("<div/>", {
    				"class":"effects",
    				"click": function(e) {
    							showTextPopup(
	    							defaultTextEditHeading, 
									item.textFont, 
									item.textAlign, 
									item.textFontColor, 
									item.textContent);
    				},
    				"html":
    				$("<i/>", {
    					"class":"icon-icon-edit"
    				})
    			})).add(
    			$("<div/>", {
    				"class":"delete",
    				"click": function(e){removeElement(i)},
    				"html":
    				$("<i/>", {
    					"class":"icon-icon-trash"
    				})
    			})).add(
    			$("<div/>", {
    				"class":"move",
    				"html":
    				$("<i/>", {
    					"class":"icon-icon-drag_reorder"
    				})
    			}))
        	}))
        }).add(
    	$("<div/>", {
    		"class":"specials",
    		"html":
    		$("<div/>", {
    			"class": "opacity opacity_settings hidden_special",
    			"html":
    			$("<input/>", {
    				"class":"opacity_chooser",
    				"data-slider-id":"opacity",
    				"type":"text",
    				"data-slider-min":"0",
    				"data-slider-max":"100",
    				"data-slider-step":"1",
    				"data-slider-value":(item.alpha*100),
    				"data-slider-tooltip":"hide",
    			})
    		})
    	}))
    });

    var opacity = $textControlContent.find('.opacity_settings input');

	opacity.slider();
	opacity.on("slide", function(slideEvt) {
		$("#opacity_"+item.id).text(slideEvt.value);
		item.alpha = slideEvt.value/100;
        item.opacityVal = slideEvt.value/100;
	});

    $textControlContent.find("#"+item.id).dblclick(function() {
        showTextPopup(
            defaultTextEditHeading, 
            item.textFont, 
            item.textAlign, 
            item.textFontColor, 
            item.textContent);
    });
    return $textControlContent;
}

function imageLayerControlTemplate(item, i){
    var $imageControlContent = 
        $("<div/>", {
        "class": "list-group-item",
        "title":item.textFullUrl,
        "html": 
        $("<div/>", {
        	"class": "description",
            "id": item.id,
        	"html":
        	$("<div/>", {
        		"class": "image_content",
        		"html":
        		$("<img/>", {
        			"src": item.texture.baseTexture.imageUrl,
        			"alt":"Preview"
        		}),
        	}).add(
        	$("<div/>", {
        		"class": "header",
        		"html": item.textUrl
        	})
        	).add(
        	$("<div/>", {
    			"class": "tools",
    			"html":
    			$("<div/>", {
    				"class":"opacity",
    				"click": function(e){
                        var closed = $(this)
                                        .closest(".list-group-item")
                                        .find('.specials .opacity')
                                        .hasClass('hidden_special');

                        $('.specials .opacity')
                            .addClass('hidden_special');
                        $('.specials .effects')
                            .addClass('hidden_special');
                        
                        if(closed) {
                            $(this)
                                .closest(".list-group-item")
                                .find('.specials .opacity')
                                .removeClass('hidden_special');
                        }
						},
    				"html":
    				$("<span/>", {
    					"id":"opacity_"+item.id,
    					"html":(item.alpha*100)
    				}).add(
    				$("<span/>", {
    					"html":"%"
    				}))
    			}).add(
    			$("<div/>", {
    				"class":"effects",
    				"click": function(e){
                        var closed = $(this)
                                        .closest(".list-group-item")
                                        .find('.specials .effects')
                                        .hasClass('hidden_special');

                        $('.specials .opacity')
                            .addClass('hidden_special');
                        $('.specials .effects')
                            .addClass('hidden_special');
                        
                        if(closed) {
                            $(this)
                                .closest(".list-group-item")
                                .find('.specials .effects')
                                .removeClass('hidden_special');
                        }
						},
    				"html":
    				$("<i/>", {
    					"class":"icon-icon-effect"
    				})
    			})).add(
    			$("<div/>", {
    				"class":"delete",
    				"click": function(e){removeElement(i)},
    				"html":
    				$("<i/>", {
    					"class":"icon-icon-trash"
    				})
    			})).add(
    			$("<div/>", {
    				"class":"move",
    				"html":
    				$("<i/>", {
    					"class":"icon-icon-drag_reorder"
    				})
    			}))
        	}))
        }).add(
    	$("<div/>", {
    		"class":"specials",
    		"html":
    		$("<div/>", {
    			"class": "opacity opacity_settings hidden_special",
    			"html":
    			$("<input/>", {
    				"class":"opacity_chooser",
    				"data-slider-id":"opacity",
    				"type":"text",
    				"data-slider-min":"0",
    				"data-slider-max":"100",
    				"data-slider-step":"1",
    				"data-slider-value":(item.alpha*100),
    				"data-slider-tooltip":"hide",
    			})
    		}).add(
    		$("<div/>", {
    			"id":"effects_settings_"+item.id,
    			"class":"effects hidden_special",
    			"html":
    			$("<div/>", {
    				"class":"option sepia",
    				"html":"Sépia",
    				"click": function(e){
    					item.makeSepia();
						$("#effects_settings_"+item.id+" .sepia").toggleClass('selected');
    				},
    			}).add(
    			$("<div/>", {
    				"class":"option gray",
    				"html":"Čierno-biela",
    				"click": function(e){
    					item.makeGray();
    					$("#effects_settings_"+item.id+" .gray").toggleClass('selected');
    				},
    			})).add(
    			$("<div/>", {
    				"class":"option invert",
    				"html":"Invertovať farby",
    				"click": function(e){
    					item.makeInvert();
    					$("#effects_settings_"+item.id+" .invert").toggleClass('selected');
    				},
    			}))
    		}))
    	}))
    });

	var opacity = $imageControlContent.find('.opacity_settings input');

	opacity.slider();
	opacity.on("slide", function(slideEvt) {
		$("#opacity_"+item.id).text(slideEvt.value);
		item.alpha = slideEvt.value/100;
        item.opacityVal = slideEvt.value/100;
	});

    return $imageControlContent;
}

function rebuildList() {
    var $layerTollbar = $("#sortable");
    $layerTollbar.empty();

    for(var i=workplace.children.length-1;i>=0;i--) {
        var item = workplace.children[i];
        if((item.isItem!==true)||(item.isBackground)) {
            continue;
        }
        var $layerControls;

        if(item.isText){
            $layerControls = textLayerControlTemplate(item, i);
        }else{
            $layerControls = imageLayerControlTemplate(item, i);
        }
            $layerControls.attr('unselectable','on')
                .css({'-moz-user-select':'-moz-none',
                    '-moz-user-select':'none',
                    '-o-user-select':'none',
                    '-khtml-user-select':'none', /* you could also put this in a class */
                    '-webkit-user-select':'none',/* and add the CSS class here instead */
                    '-ms-user-select':'none',
                    'user-select':'none'
                })
                .bind('selectstart', function(){ return false; });

        $layerTollbar.append($layerControls);
    }

    var sortable = new Sortable(document.getElementById('sortable'), {
		animation: 200,
		handle: ".move",
        sort: true,
        fallbackOnBody: true,
        onStart: function (/**Event*/evt) {
            $(".specials .opacity").addClass('hidden_special');
            $(".specials .effects").addClass('hidden_special');
        },
        onMove: function (/**Event*/evt) {
            var id_moved = $(evt.dragged).find('.description').attr("id");
            var id_swapped = $(evt.related).find('.description').attr("id");
            
            var moved;
            var swapped;

            $.each(workplace.children, function( index, item ) {
                if(id_moved == item.id) {
                    moved = item;
                }
                if(id_swapped == item.id) {
                    swapped = item;
                }
            });

            workplace.swapChildren(moved, swapped);
        },
	});

    if(selectedLayer != null) {
        $("#"+selectedLayer).addClass("active_layer");
        for(var i in workplace.children) {
            if(workplace.children[i].id == selectedLayer) {
                selectedLayerIndex=i;
                activateLayer($("#"+selectedLayer));
                break;
            }
        }

    }

    $("#sortable .list-group-item .description").click(function() {
        activateLayer(this);
    });
}

function activateLayer(layer) {
    selectedLayer = layer.id;

    for(var i in workplace.children) {
        if(workplace.children[i].id == selectedLayer) {
            selectedLayerIndex=i;
            break;
        }
    }

    $("#sortable .list-group-item .description").removeClass("active_layer");
    $(layer).addClass("active_layer");

    var rotation = workplace.children[selectedLayerIndex].rotation;
    var scale = workplace.children[selectedLayerIndex].scaleSize;

    rotateSlider.slider('setValue', rotation);
    $("#rotate_value").text(((rotation/(Math.PI*2))*100).toFixed(1));

    $("#rotate").on("slide", function(slideEvt) {
        $("#rotate_value").text(((slideEvt.value/(Math.PI*2))*100).toFixed(1));
        workplace.children[selectedLayerIndex].makeRotate(slideEvt.value);
    });

    sizeSlider.slider('setValue', scale);
    $("#size_value").text(((scale/(3))*100).toFixed(1));

    $("#size").on("slide", function(slideEvt) {
        $("#size_value").text(((slideEvt.value/(3))*100).toFixed(1));
        workplace.children[selectedLayerIndex].makeScale(slideEvt.value);
    });

    $("#top_alignment").unbind().click(function() {
       workplace.children[selectedLayerIndex].moveTop(); 
    });

    $("#bottom_alignment").unbind().click(function() {
       workplace.children[selectedLayerIndex].moveBottom(); 
    });

    $("#left_alignment").unbind().click(function() {
       workplace.children[selectedLayerIndex].moveLeft(); 
    });

    $("#right_alignment").unbind().click(function() {
       workplace.children[selectedLayerIndex].moveRight(); 
    });

    $("#center_alignment").unbind().click(function() {
       workplace.children[selectedLayerIndex].moveCenter(); 
    });
}

function removeElement(id) {
    workplace.children.splice(id,1);
    rebuildList();
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(timestamp) {    
    
    frameId = requestAnimationFrame(animate);
    render();

    if (canvasViews[selectedView] != undefined) {
        canvasViews[selectedView].render(stages[selectedStage]);
    }
    if (allActiveTextures[selectedView] != undefined){
        allActiveTextures[selectedView].needsUpdate = true;
    }
}

function render() {
    try {

        if(rendering) {
            renderer.render(scene, camera);
            rendering = false;
        }

        stats.update();
    } catch (e) {}

}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL//.replace(/^data:image\/(png|jpg);base64,/, "");
}

function generateJSON() {
    var exportedFile = new Object();
    exportedFile.product = selectedProduct;
    exportedFile.textures = new Array();

    $.each(stages, function(index, value) {
        var ex_workplace = value.children[0];
        var new_texture = new Object();
        new_texture.name = ex_workplace.hiddenName;
        new_texture.size = {
            width: canvasViews[index].width,
            height: canvasViews[index].height
        };

        new_texture.content = new Array();

        $.each(ex_workplace.children, function(index, value) {
            
            if(!value.isBackground) {
                var ex_element = new Object();

                ex_element.size = {
                    width: value.width,
                    height: value.height
                };

                ex_element.position = value.position;
                ex_element.opacity = value.opacityVal;
                ex_element.rotation = value.rotation;
                if(value.isText) {
                    ex_element.type = 'text';
                    ex_element.content = value.textContent;
                    ex_element.fontType = value.textFont;
                    ex_element.fontSize = value.textFontSize;
                    ex_element.fontColor = getRGBobject(value.textFontColor);
                    ex_element.align = value.textAlign;
                } else {
                    ex_element.type = 'image';
                    ex_element.imageUrl = getBase64Image(value.texture.baseTexture.source);
                    //ex_element.fileType = value.texture.baseTexture.source.src.split('.').pop(); 
                    ex_element.effectInvert = value.hasInvert;
                    ex_element.effectSepia = value.hasSepia;
                    ex_element.effectGray = value.hasGray;
                }

                new_texture.content.push(ex_element);
            }
        });

        exportedFile.textures.push(new_texture);
    });

    var myString = JSON.stringify(exportedFile);
    return myString;
}

function exportFile(filename) {
    var element = document.createElement('a');
    var data = new Blob([generateJSON()], { type: 'text/plain' }); 
    var myurl = URL.createObjectURL(data);

    element.setAttribute('href', myurl);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

//TODO delete
function setCoordinates(elem, index, x,y,z) {
            elem.vertices[index].x = x;    
            elem.vertices[index].y = y;    
                        elem.vertices[index].z = z;    
                    elem.dynamic = true; 
                    elem.verticesNeedUpdate = true;
}