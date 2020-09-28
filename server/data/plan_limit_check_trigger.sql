CREATE DEFINER=`root`@`%` TRIGGER plan_limit_check
BEFORE INSERT ON `user`
FOR EACH ROW
BEGIN

	SET @plan_limit = (SELECT pl.users FROM plan_limit pl WHERE pl.company_id = NEW.company_id LIMIT 1);
	SET @current_users = (SELECT count(id) FROM `user` u WHERE u.company_id = NEW.company_id);

	if @current_users >= @plan_limit then
	    SET @error_message = CONCAT('You have reached the limit of users (', @plan_limit, ') allowed by your plan.');
    	signal sqlstate '45000' SET MESSAGE_TEXT = @error_message;
    end if;

end
