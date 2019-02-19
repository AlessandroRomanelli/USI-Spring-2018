$('.stats').each(function(){
  console.log(typeof this.id =='undefined' ? 'sorry, no id ' : this.id);
});