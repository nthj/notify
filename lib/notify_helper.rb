module NotifyHelper
  def notify_message flash_or_message
    if flash_or_message.kind_of?(Hash) 
      "Notify".tap do |notifier|
        flash_or_message.values.each do |message|
          notifier << ".send('#{escape_javascript message}')"
        end
        notifier << ';'
      end unless flash_or_message.values.empty?
    else
      "Notify.send('#{escape_javascript flash_or_message}');" unless flash_or_message.nil? || flash_or_message.blank?
    end
  end
  
  def notify flash_or_message = '', &block
    msg = block_given? ? yield(flash_or_message) : flash_or_message
    if defined? page
      page << "Notify.send('#{msg}')".html_safe
    else
      content_tag :script, notify_message(msg).html_safe, :type => 'text/javascript' unless
        msg.nil? || msg.blank? 
    end
  end
end
