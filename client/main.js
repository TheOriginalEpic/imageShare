import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import '../lib/collections.js';

Template.mainBody.helpers({
  	bodyAll() {
    	return imageDB.find({}, {sort:{upvote: -1}});
  	},

  	imagesFound(){
  		return imageDB.find().count();
  	},
});

Template.mainBody.events({
	'click .js-upvote'(event, instance) {
		var mainBodyID = this._id;
		var upvotes = imageDB.findOne({_id: mainBodyID}).upvote;

		//console.log(mainBodyID);            

		if (!upvotes){
			upvotes = 0;
		}    

		upvotes++;

		imageDB.update({_id: mainBodyID}, {$set:{'upvote':upvotes}});
	},

	'click .js-downvote'(event, instance) {
		var mainBodyID = this._id;
		var downvotes = imageDB.findOne({_id: mainBodyID}).downvote;                  

		if (!downvotes){
			downvotes = 0;
		}    

		downvotes++;

		imageDB.update({_id: mainBodyID}, {$set:{'downvote':downvotes}});
	},

	'click .js-view'(event, instance) {
		var viewID = this._id;
		$('#eImage').val(imageDB.findOne({_id:viewID}).img);
		$('#eTitle').val(imageDB.findOne({_id:viewID}).title);
		$('#eDescription').val(imageDB.findOne({_id:viewID}).desc);
		$('#eImgPreview').attr('src', imageDB.findOne({_id:viewID}).img);

		//userDB.update({_id: viewID}, {$set:{'title':eTitle, 'author':eAuthor, 'desc':eDescription, 'img':eCoverImage}});

		$('#editBook').modal('show');
	},

	'click .js-edit'(event, instance) {
		var editID = this._id;
		console.log(editID);
		
		$('#eImage').val(imageDB.findOne({_id:editID}).img);
		$('#eTitle').val(imageDB.findOne({_id:editID}).title);
		$('#eDescription').val(imageDB.findOne({_id:editID}).desc);
		$('#eImgPreview').attr('src', imageDB.findOne({_id:editID}).img);
		$('#imgEditID').val(imageDB.findOne({_id:editID})._id);		

		$('#imgEdit').modal('show');
	},

	'click .js-delete'(event, instance){
		var deleteID = this._id;

		var confirmation = confirm("Are you sure you want to delete this");

		if (confirmation == true) {
			$('#' + deleteID).fadeOut('slow', function(){
				imageDB.remove({_id:deleteID});
			});			
		}		
	},
});

Template.myJumbo.events({
	'click .js-addImg'(event, instance) {
		$('#imgAdd').modal('show');
	},
});

Template.addImg.events({
	'click .js-save'(event, instance) {
		var Image = $('#Image').val();
		var Title = $('#Title').val();
		var imgDesc = $('#Description').val();

		if (Image == ""){
			Image = "noImage.png";
		}

		imageDB.insert({'title':Title, 'img':Image, 'desc':imgDesc, 'createdOn':Date()});

		$('#Image').val('');
		$('#Title').val('');
		$('#Description').val('');
		$('#imgPreview').attr('src', 'noImage.png');

		$('#imgAdd').modal('hide');
	},

	'click .js-cancel'(event, instance){
		$('#Image').val('');
		$('#Title').val('');
		$('#Description').val('');
		$('#imgPreview').attr('src', 'noImage.png');

		$('#imgAdd').modal('hide');
	},

	'input #Image'(event, instance) {
		var Image = $('#Image').val();
		$('#imgPreview').attr('src', Image);
	},
});

Template.editImg.events({
	'click .js-eUpdate'(event, instance){
		var Save = $('#imgEditID').val();

		var Image = $('#eImage').val();
		var Title = $('#eTitle').val();
		var imgDesc = $('#eDescription').val();

		$('#eImage').val('');
		$('#eTitle').val('');
		$('#eDescription').val('');
		$('#eImgPreview').attr('scr', Image);

		imageDB.update({_id: Save}, {$set:{'title':Title, 'img':Image, 'desc':imgDesc}});

		$('#editImg').modal('show');
	},

	'click .js-cancel'(event, instance){
		var Image = $('#eImage').val();

		$('#Image').val('');
		$('#Title').val('');
		$('#Description').val('');
		$('#imgPreview').attr('src', Image);

		$('#editImg').modal('hide');
	},
});
