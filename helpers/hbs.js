const moment = require('moment');
module.exports={
    formatDate:(date,format)=>{
      return moment(date).format(format);
    },
    truncate:(str,len)=>{
     if(str.length > len && str.length>0){
         let new_str = str+' ';
         new_str=str.substr(0,len);
         new_str=str.substr(0, new_str.lastIndexOf(' '));
         new_str = new_str.length>0?new_str : str.substr(0,len);
         return new_str + '...';
     }
      return str
    },
    stripTags:(input)=>{
       return input.replace(/<(?:.|\n)*?>/gm,'');
    },
    editIcon:(storyUser,loggedUser,storyId,floating=true)=>{
        if(storyUser._id.toString() == loggedUser._id.toString()){ //checking story user id is equal to loged in user id
           if(floating){
             return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit " style="font-size:16px;"></i></a>`
           }
           else{
             return`<a href="/stories/edit/${storyId}"><i class="fas fa-edit " style="font-size:16px;><</a>`
           }
        }
        else{
          return'';
        }
    },
    select:(selected,options)=>{ // if users want edit the post so thier last status should be automatically selected
       return options
       .fn(this)
       .replace(
         new RegExp('value="'+ selected +'"'),
         '$& selected="selected"'
       )
       .replace(
         new RegExp('>'+selected+'</option>'),
         ' selected="selected"$&'
       )
    }
}