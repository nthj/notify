var Notify = {
	
	bar : null,
	
	time_in_between_messages : 1,
	
	time_to_display_each_message : 5,
	
	message : null,

	queue : [],
	
	skipped : false, 
	
	status : 'closed',
	
	animateNextMessage : function()
	{
		Notify.message.appear(); return Notify;
	},
	
	changeToNextMessage : function()
	{
		Notify.message.update(Notify.queue.shift()); return Notify;
	},
	
	cleanUpNotificationBar : function()
	{
		Notify.markAsClosed();
		Notify.message.update('');	
	},
	
	displayFirstMessage : function()
	{
		Notify.changeToNextMessage().animateNextMessage().displayNextInQueue.delay(
			Notify.time_to_display_each_message - Notify.time_in_between_messages
		);	
	},
	
	displayNextInQueue : function()
	{
		if ( Notify.skipped )
		{
			Notify.skipped = false;
			return Notify;
		}
		
		Notify.fadeCurrentMessage();
		
		if ( Notify.hasNoMoreMessages() )
		{
			Notify.shutNotificationBar();
		}
		else
		{
			Notify.changeToNextMessage.delay(Notify.time_in_between_messages);
			Notify.animateNextMessage.delay(Notify.time_in_between_messages);
			Notify.displayNextInQueue.delay(Notify.time_to_display_each_message);
		}
		
		return Notify;
	},
	
	fadeCurrentMessage : function()
	{
		Notify.message.fade({
			duration : 0.4
		}); return Notify;
	},
	
	hasClosedNotificationBar : function()
	{
		return 'closed' == Notify.status;
	},
	
	hasNoMoreMessages : function()
	{
		return 0 == Notify.queue.size();
	},
	
	hasNotQueuedNotificationBar : function()
	{
		return 'queued' != Notify.status;
	},
	
	isClosingNotificationBar : function()
	{
		return 'closing' == Notify.status;
	},
	
	markAsClosed : function()
	{
		return Notify.mark('closed');
	}, 
	
	markAsClosing : function()
	{
		return Notify.mark('closing');
	}, 
	
	markAsOpen : function()
	{
		return Notify.mark('open');
	}, 
	
	markAsQueued : function()
	{
		return Notify.mark('queued');
	}, 
	
	mark : function(status)
	{
		Notify.status = status; return Notify;
	}, 
	
	openNotificationBar : function()
	{
		Notify.bar.setStyle({ left : '-5000px' }).show().slideDown({
			afterFinish : function()
			{
				Notify.bar.setStyle({ left : '0' });
			}, 
			beforeStart : function()
			{
				Element.setStyle.delay(0.3, Notify.bar, { left : '0' });
			}
		});
		
		Notify.displayFirstMessage.delay(0.5);
		
		return Notify.markAsOpen();
	}, 
	
	queueNotificationBar : function()
	{
		Notify.markAsQueued();
		Notify.openNotificationBar.delay(2);
	},
	
	send : function(message)
	{
		if ( 0 == message.length )
		{
			return Notify;
		}
		
		if ( ! Notify.bar )
		{
			Notify.setup();
		}
		
		Notify.queue.push(message);
		
		if ( Notify.hasClosedNotificationBar() )
		{
			Notify.openNotificationBar();
		}
		else if ( Notify.isClosingNotificationBar() && Notify.hasNotQueuedNotificationBar() )
		{
			Notify.queueNotificationBar();
		}
		
		return Notify;
	},
	
	setup : function()
	{
		$$('body').first().insert({
			bottom : new Element('div', { id : 'notify' }).hide().observe('click', Notify.skip).insert({
				bottom : new Element('div').update('&nbsp;').insert(
					new Element('span', { id : 'notify-message' }).hide()
				)
			})
		});
		
		Notify.bar 		= $('notify');
		Notify.message 	= $('notify-message');
	},
	
	shutNotificationBar : function()
	{
		Notify.bar.slideUp({
			afterFinish : Notify.cleanUpNotificationBar, 
			delay 		: 0.5
		}); return Notify.markAsClosing();
	},
	
	skip : function(e)
	{
		if ( Event.element(e).hasClassName('ignore') )
		{
			Event.element(e).addClassName('clicked')
		}
		else
		{
			Notify.displayNextInQueue().skipped = true;
		}
	}
}
