import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import '../lib/collections.js';

Template.mainBody.helpers({
  	bodyAll() {
  		return imageDB.findOne({});
    	// return imageDB.find({}, {sort:{upvote: -1}});
  	},
});

// Template.mainBody.events({

// });

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

		imageDB.insert({'title':Title, 'img':Image, 'desc':imgDesc});

		$('#Image').val('');
		$('#Title').val('');
		$('#Description').val('');

		$('#imgAdd').modal('hide');
	},

	'change #Image'(event, instance) {
		var Image = $('#Image').val();
		$('#imgPreview').attr('src', Image);
	},
});
