import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Accounts } from 'meteor/accounts-base';

import './main.html';
import '../lib/collections.js';

Session.set('imgLimit', 3);
Session.set('userFilter', false);

lastScrollTop = 0;
$(window).scroll(function(event){

	if ($(window).scrollTop() + $(window).height() > $(document).height() - 100){
		var scrollTop = $(this).scrollTop();

		if (scrollTop > lastScrollTop){
			Session.set('imgLimit', Session.get('imgLimit') + 3);			
		}

		lastScrollTop = scrollTop;
	}
});

Accounts.ui.config({

  passwordSignupFields: 'USERNAME_ONLY',

});

Template.mainBody.helpers({
  	bodyAll() {
  		if (Session.get("userFilter") == false){
	  		var time = new Date() - 15000;
	  		var results = imageDB.find({'createdOn': {$gte:time}}).count();
	  		if (results > 0){
	  			return imageDB.find({}, {sort:{createdOn: -1, rating: -1}, limit:Session.get('imgLimit')});
	  		} else {
	    		return imageDB.find({}, {sort:{rating: -1, createdOn: 1}, limit:Session.get('imgLimit')});
	    	} 
    	} else {
    		return imageDB.find({postedBy:Session.get("userFilter")}, {sort:{rating: -1, createdOn: 1}, limit:Session.get('imgLimit')});
    	}  	
  	},

  	imageAge(){
  		var imgCreatedOn = imageDB.findOne({_id:this._id}).createdOn;
  		imgCreatedOn = Math.round((new Date() - imgCreatedOn) / 60000);

  		var unit = " mins";

  		if (imgCreatedOn > 60){
  			imgCreatedOn = Math.round(imgCreatedOn / 60);
  			unit = " hours";
  		}

  		if (imgCreatedOn > 1440){
  			imgCreatedOn = Math.round(imgCreatedOn / 1440);
  			unit = " days";

  		}

  		return imgCreatedOn + unit;
  	},

  	imagesFound(){
  		return imageDB.find().count();
  	},

  	userLoggedIn(){
  		var logged = imageDB.findOne({_id:this._id}).postedBy;
  		return Meteor.users.findOne({_id:logged}).username;
  	},

  	userId(){
  		return imageDB.findOne({_id:this._id}).postedBy;
  	},
});

Template.mainBody.events({
	'click .usrClick'(event, instance){
		event.preventDefault();
		Session.set("userFilter", event.currentTarget.id);
	},

	'click js-clearFilter'(event, instance){
		Session.set("userFilter", false);
	}

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

	'click .js-rate'(event, instance){
		var rateID = this.data_id;
		var Rating = $(event.currentTarget).data('userrating');

		imageDB.update({_id:rateID}, {$set:{'rating': Rating}});
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

		imageDB.insert({'title':Title, 'img':Image, 'desc':imgDesc, 'createdOn':new Date().getTime(), 'postedBy':Meteor.user()._id});

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

		imageDB.update({_id: Save}, {$set:{'title':Title, 'img':Image, 'desc':imgDesc, 'createdOn':new Date().getTime()}});

		$('#imgEdit').modal('hide');
	},

	'click .js-cancel'(event, instance){
		var Image = $('#eImage').val();

		$('#Image').val('');
		$('#Title').val('');
		$('#Description').val('');
		$('#imgPreview').attr('src', Image);

		$('#imgEdit').modal('hide');
	},
});
