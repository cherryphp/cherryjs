//CherryJs upload image class supported jquery and standard javascript
var CherryUploadImage = {
	createNew: function(){
		var upimg = {};
		
		// function getimgobj response image data loaded after upload image
		upimg.upload = function(imgobj,url,data,fun){
			imgobj.img.onload = function(){
                data.imgdata = imgobj.img.src;
                data.type = imgobj.type;
				$.ajax({
					type:'post',      
					url:url,  
					data:data,
					dataType:'json', 
					async: false,
					success: function(data){
                        fun(data);
					}
				});
			}
		}
		
		// this function return {"img":imgobj,"type":image type} imgobj params is image compressed code
		upimg.getimgobj = function(file){
			var name = file.name;
			var size = file.size;
			var type = file.type;
			if (!type) { 
				var mime = {'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'bmp': 'image/bmp', 'PNG': 'image/png', 'JPG': 'image/jpeg', 'JPEG': 'image/jpeg', 'BMP': 'image/bmp'}; 
				type = mime[file.name.match(/\.([^\.]+)$/i)[1]]; 
			}
			var aimgs = new Image();
			var reader = new FileReader();
			reader.onload = function(e){
				var imgs = new Image();
				imgs.src=e.target.result;
				imgs.onload = function(){
					aimgs.src=upimg.compress(imgs);
				}
			}
			reader.readAsDataURL(file);
			return {"img":aimgs,"type":type};
		}
		
		// compress image code
		upimg.compress = function(img){
			var base64size = img.src.length;
			var width = img.width;
			var height = img.height;
			var canvas = document.createElement('canvas');
			canvas.width = width/2;
			canvas.height = height/2;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, width/2, height/2);
			var canvas_data = canvas.toDataURL("image/jpeg",0.2);
			//console.log("base64_size:"+base64size);
			//console.log("compress_size:"+canvas_data.length);
			return canvas_data;
		};
		
		return upimg;
	}
};


var CherryDataTables = {
	createNew: function(){
		var datatables = {};
		// create data table
		datatables.ctablesort = function(obj){
			var th_list = obj.getElementsByTagName("th");
            for(var i = 0; i < th_list.length; i++){
                th_list[i].addEventListener("click",function(){
                    if (this.getAttribute("class") !== null){
                        var th_list = obj.getElementsByTagName("th");
                        for(var i = 0; i < th_list.length; i++){
                            if (this == th_list[i]){
                                this.getAttribute("class") == "sorting"?this.setAttribute("class","sorting_asc"):this.getAttribute("class") == "sorting_asc"?this.setAttribute("class","sorting_desc"):this.setAttribute("class","sorting");
                            }else if (th_list[i].getAttribute("class") !== null){
                                th_list[i].setAttribute("class","sorting");
                            }
                        }
                        pages(obj.getAttribute("data-pagenum"));
                    }
                },true);
            }
		}
        
        datatables.getcolumnchecked = function(obj){
			var th_list = obj.getElementsByTagName("th");
            var redata={dataname:'',order:''}
            for(var i = 0; i < th_list.length; i++){
                if (th_list[i].getAttribute("class") !== "sorting" && th_list[i].getAttribute("class") !== null){
                    redata={dataname:th_list[i].getAttribute("data-name"),order:th_list[i].getAttribute("class")=="sorting_asc"?"asc":"desc"}
                    return redata;
                }
            }
            return redata;
		}
        
		return datatables;
	}
};