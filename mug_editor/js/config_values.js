var stages = new Array();

var defaultTextHeading = "Vložiť text";
var defaultTextEditHeading = "Upraviť text";
var textIcon = "images/icons/icon-text-a.png";
var firstLogo = "images/content/logo.jpg";
var isShowingTextPopup = false;
var isShowingImagePopup = false;
var layerId = 1000;
//FONTS SETTINGS
var textFonts = [
    "Times New Roman", 
    "Courier New", 
    "Comic Sans MS", 
    "Impact",
    "montserrat",
    "Snacker Comic"];

var defaultTextColor = "#000000";
var defaultTextSize = 400;
var defaultTextFont = textFonts[0];

var noCupCameraZ = 1100;

//TEXTURE SETTINGS
var defaultCupTexture = "images/materials/cup_AO.jpg";
var cupTextures = {
    'white': "images/materials/cup_AO.jpg", 
    'black': "images/materials/cup_AO-black.jpg", 
    'blue': "images/materials/cup_AO-blue.jpg", 
    'green': "images/materials/cup_AO-green.jpg", 
    'magenta': "images/materials/cup_AO-magenta.jpg", 
    'orange': "images/materials/cup_AO-orange.jpg", 
    'red': "images/materials/cup_AO-red.jpg",
    'glass': "none"
}

//PREVIEW AREA
var outline = {size: 4  ,
               dash: 12,
               space: 7,
               color: 0xadadad
};

var controls_size = {
    width: 50,
    height: 50        
};

var controls_type = {
    trash: 1,
    scale: 2,
    rotate: 3
};

//PREVIEWS TO CONTENT
var preview_attributes = {
    "cup": [
        {
            name: "Potlač",
            printAreaSize: {
                width: 2421,
                height: 1134
            },
            css: {
                width: 807,
                height: 378
            },
        }
    ],
    "stone15": [
        {
            name: "Kameň 15x15",
            printAreaSize: {
                width: 1181,
                height: 1181
            },
            css: {
                width: 450,
                height: 450
            },
            texture: {
                src:'images/materials/00250 Fotokameň štvorcový 15 x 15 cm.png',
                size: {
                    width:900,
                    height:900
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x:-504, y: 524, z:180},
                { x: 454, y: 672, z:0},
                { x:-342, y:-528, z:180},
                { x: 616, y:-380, z:0}
            ]
        }
    ],
    "stone20": [
        {
            name: "Kameň 20x20",
            printAreaSize: {
                width: 1772,
                height: 1772
            },
            css: {
                width: 450,
                height: 450
            },
            texture: {
                src:'images/materials/00251 Fotokameň štvorcový 20 x 20 cm.png',
                size: {
                    width:900,
                    height:900
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x:-504, y: 524, z:180},
                { x: 454, y: 672, z:0},
                { x:-342, y:-528, z:180},
                { x: 616, y:-380, z:0}
            ]
        }
    ],
    "stone30": [
        {
            name: "Kameň 30x30",
            printAreaSize: {
                width: 2953,
                height: 2953
            },
            css: {
                width: 450,
                height: 450
            },
            texture: {
                src:'images/materials/00252 Fotokameň štvorcový 30 x 30 cm.png',
                size: {
                    width:900,
                    height:900
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x:-504, y: 524, z:180},
                { x: 454, y: 672, z:0},
                { x:-342, y:-528, z:180},
                { x: 616, y:-380, z:0}
            ]
        }
    ],
    "stone1520": [
        {
            name: "Kameň 15x20",
            printAreaSize: {
                width: 1772,
                height: 1181
            },
            css: {
                width: 591,
                height: 443
            },
            texture: {
                src:'images/materials/00253 Fotokameň obdĺžníkový 15 x 20 cm.png',
                size: {
                    width:886,
                    height:886
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x:-650, y: 450, z:120},
                { x: 652, y: 568, z:0},
                { x:-572, y:-424, z:120},
                { x: 732, y:-302, z:0}
            ]
        }
    ],
    "stone2030": [
        {
            name: "Kameň 20x30",
            printAreaSize: {
                width: 2953,
                height: 1772
            },
            css: {
                width: 591,
                height: 443
            },
            texture: {
                src:'images/materials/00254 Fotokameň obdĺžníkový 20 x 30.png',
                size: {
                    width:886,
                    height:886
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x:-650, y: 450, z:120},
                { x: 652, y: 568, z:0},
                { x:-572, y:-424, z:120},
                { x: 732, y:-302, z:0}
            ]
        }
    ],
    "stone1515r": [
        {
            name: "Kameň oblúk 15x15",
            printAreaSize: {
                width: 1181,
                height: 1181
            },
            css: {
                width: 443,
                height: 443
            },
            texture: {
                src:'images/materials/00253 Fotokameň oblúkový 15 x 15 cm.png',
                shadow: 'images/materials/maska-00253-Fotokameň-oblúkový-15-x-15-cm.png',
                preview: 'images/materials/00253 Fotokameň oblúkový šablóna.png',
                shadow_scale: 0.63,
                size: {
                    width:571,
                    height:813
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x:-513, y: 571, z:700},
                { x: 339, y: 723, z:0},
                { x:-323, y:-467, z:700},
                { x: 529, y:-327, z:0}
            ]
        }
    ],
    "stone2020r": [
        {
            name: "Kameň oblúk 20x20",
            printAreaSize: {
                width: 1772,
                height: 1772
            },
            css: {
                width: 443,
                height: 443
            },
            texture: {
                src:'images/materials/00253 Fotokameň oblúkový 15 x 15 cm.png',
                shadow: 'images/materials/maska-00253-Fotokameň-oblúkový-15-x-15-cm.png',
                preview: 'images/materials/00253 Fotokameň oblúkový šablóna.png',
                shadow_scale: 0.63,
                size: {
                    width:571,
                    height:813
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x:-513, y: 571, z:700},
                { x: 339, y: 723, z:0},
                { x:-323, y:-467, z:700},
                { x: 529, y:-327, z:0}
            ]
        }
    ],
    "pillow_saten": [
        {
            name: "Obliečka saténová",
            printAreaSize: {
                width: 4370,
                height: 4370
            },
            css: {
                width: 600,
                height: 600
            },
            texture: {
                src:'images/materials/00601 Obliečka saténová 200g.png',
                size: {
                    width:600,
                    height:600
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x:-405, y: 435, z:0},
                { x: 405, y: 435, z:0},
                { x:-405, y:-435, z:0},
                { x: 405, y:-435, z:0}
            ]
        }
    ],
    "pillow_polyester": [
        {
            name: "Obliečka polyesterová",
            printAreaSize: {
                width: 4370,
                height: 4370
            },
            css: {
                width: 600,
                height: 600
            },
            texture: {
                src:'images/materials/00600 Obliečka polyesterová 160g foto.png',
                size: {
                    width:600,
                    height:600
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x:-405, y: 415, z:0},
                { x: 405, y: 415, z:0},
                { x:-405, y:-415, z:0},
                { x: 405, y:-415, z:0}
            ]
        }
    ],
    "podlozka_obdlznik": [
        {
            name: "Podložka obdĺžniková",
            printAreaSize: {
                width: 2362,
                height: 1920
            },
            css: {
                width:550,
                height:448
            },
            texture: {
                src:'images/materials/podlozka_stvorcova.png',
                shadow: 'images/materials/podlozka_stvorcova-maska.png',
                preview: 'images/materials/00451 Podložka obdĺžníková custom šablóna.png',
                shadow_scale: 0.63,
                size: {
                    width:887,
                    height:740
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x:-534, y: 510, z:440},
                { x: 680, y: 510, z:0},
                { x:-534, y:-495, z:440},
                { x: 680, y:-495, z:0}
            ]
        }
    ],
    "podlozka_kruh": [
        {
            name: "Podložka kruhová",
            printAreaSize: {
                width: 2138,
                height: 2138
            },
            css: {
                width:400,
                height:400
            },
            texture: {
                src:'images/materials/00453 Podložka kruhová 5 mm copyright.png',
                shadow: 'images/materials/maska-00453 Podložka kruhová 5 mm copyright.png',
                preview: 'images/materials/00453 Podložka kruhová custom šablóna.png',
                shadow_scale: 0.63,
                size: {
                    width:600,
                    height:600
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x:-512, y: 311, z:0},
                { x: 512, y: 311, z:0},
                { x:-512, y:-326, z:400},
                { x: 512, y:-326, z:400}
            ]
        }
    ],
    "podlozka_srdce": [
        {
            name: "Podložka srdiečková",
            printAreaSize: {
                width: 2539,
                height: 2067
            },
            css: {
                width:400,
                height:400
            },
            texture: {
                src:'images/materials/podlozka_srdce.png',
                //shadow: 'images/materials/podlozka_srdce-mask.png',
                preview: 'images/materials/00454 Podložka srdiečková 3 mm šablona.png',
                //shadow_scale: 2,//0.63,
                size: {
                    width:920,
                    height:700
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x:-384, y:-054, z:900},
                { x: 232, y: 410, z:0},
                { x: 018, y:-494, z:900},
                { x: 648, y:-030, z:0}
            ]
        }
    ],
    "klucenka_kruh": [
        {
            name: "Kľúčenka kruhová",
            printAreaSize: {
                width: 543,
                height: 543
            },
            css: {
                width:350,
                height:350
            },
            texture: {
                src:'images/materials/00320 Kľúčenka plastová kruhová 4 cm.png',
                shadow: 'images/materials/maska-00320 Kľúčenka plastová kruhová 4 cm.png',
                preview: 'images/materials/00320 Kľúčenka plastová kruhová 4 cm šablóna.png',
                shadow_scale: 0.63,
                size: {
                    width:1000,
                    height:1000
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x: 022, y: 280, z:0},
                { x: 958, y: 172, z:0},
                { x:-026, y:-174, z:0},
                { x: 906, y:-282, z:0}
            ]
        }
    ],
    "klucenka_oval": [
        {
            name: "Kľúčenka oválna",
            printAreaSize: {
                width: 791,
                height: 555
            },
            css: {
                width:395,
                height:277
            },
            texture: {
                src:'images/materials/00322 Kľúčenka plastová oválna 68x48.png',
                shadow: 'images/materials/maska-00322 Kľúčenka plastová oválna 68x48.png',
                preview: 'images/materials/00322 Kľúčenka plastová oválna custom šablóna.png',
                shadow_scale: 0.63,
                size: {
                    width:1000,
                    height:1000
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x:-192, y: 392, z:0},
                { x: 1052, y: 168, z:0},
                { x:-276, y:-080, z:0},
                { x: 960, y:-300, z:0}
            ]
        }
    ],
    "rukavica": [
        {
            name: "Rukavica",
            printAreaSize: {
                width: 945,
                height: 2362
            },
            css: {
                width:280,
                height:580
            },
            texture: {
                src:'images/materials/00507 Rukavica na pečenie 30 x 14 cm šablóna1.png',
                size: {
                    width:678,
                    height: 808
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x:-104, y: 572, z:0},
                { x: 388, y: 572, z:0},
                { x:-104, y:-582, z:0},
                { x: 388, y:-582, z:0}
            ]
        }
    ],
    "chnapka": [
        {
            name: "Chňapka",
            printAreaSize: {
                width: 1535,
                height: 1535
            },
            css: {
                width:500,
                height:500
            },
            texture: {
                src:'images/materials/00540 Kuchynská chňapka.png',
                size: {
                    width:700,
                    height: 700
                },
                position: {
                    x: 0,
                    y: 0
                }
            },
            geometry: [
                { x:-460, y: 400, z:0},
                { x: 500, y: 400, z:0},
                { x:-460, y:-560, z:0},
                { x: 500, y:-560, z:0}
            ]
        }
    ],
    "tricko_polyester_unisex": [
        {
            name: "P",
            printAreaSize: {
                width: 3058,
                height: 4961
            },
            css: {
                width: 300,
                height: 460
            },
            texture: {
                src:'images/materials/Tričko polyesterové Unisex z predu.png',
                size: {
                    width:749,
                    height:850
                },
                position: {
                    x: -500,
                    y: 0
                }
            },
            geometry: [
                { x:-280, y: 400, z:0},
                { x: 280, y: 400, z:0},
                { x:-280, y:-525, z:0},
                { x: 280, y:-525, z:0}
            ]
        },
        {
            name: "Z",
            printAreaSize: {
                width: 3058,
                height: 4961
            },
            css: {
                width: 300,
                height: 460
            },
            texture: {
                src:'images/materials/Tričko polyesterové Unisex zo zadu.png',
                size: {
                    width:749,
                    height:850
                },
                position: {
                    x: 500,
                    y: 0
                }
            },
            geometry: [
                { x:-280, y: 400, z:0},
                { x: 280, y: 400, z:0},
                { x:-280, y:-525, z:0},
                { x: 280, y:-525, z:0}
            ]
        },
        {
            name: "L",
            printAreaSize: {
                width: 1535,
                height: 1772
            },
            css: {
                width: 366,
                height: 480
            },
            texture: {
                src:'images/materials/Tričko polyesterové Unisex z boku.png',
                size: {
                    width:384,
                    height:381
                },
                position: {
                    x: 0,
                    y: 200
                }
            },
            geometry: [
                { x:-050, y: 080, z:0},
                { x: 150, y: 080, z:0},
                { x:-050, y:-155, z:0},
                { x: 150, y:-155, z:0}
            ]
        },{
            name: "R",
            printAreaSize: {
                width: 1535,
                height: 1772
            },
            css: {
                width: 366,
                height: 480
            },
            texture: {
                src:'images/materials/Tričko polyesterové Unisex z boku2.png',
                size: {
                    width:384,
                    height:381
                },
                position: {
                    x: 0,
                    y: -200
                }
            },
            geometry: [
                { x:-170, y: 100, z:0},
                { x: 030, y: 100, z:0},
                { x:-170, y:-135, z:0},
                { x: 030, y:-135, z:0}
            ]
        }
    ],
};

