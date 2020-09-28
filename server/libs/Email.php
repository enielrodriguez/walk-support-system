<?php

use EmailReplyParser\Parser\EmailParser;

class Email
{
    private $sender;
    private $senderName;
    private $ticket;
    private $ticketNumber;
    private $content;
    private $attachment;
    private $subject;

    public function __construct($data)
    {
        $this->sender = $this->parseSender($data);
        $this->senderName = $this->parseSenderName($data);
        $this->ticketNumber = $this->parseTicketNumber($data);
        $this->ticket = $this->parseTicket();
        $this->content = $this->parseContent($data);
        $this->attachment = $this->parseAttachment($data);
        $this->subject = $this->parseSubject($data);
    }

    public function isReply()
    {
        return !$this->ticket->isNull();
    }

    public function getSender()
    {
        return $this->sender;
    }

    public function getTicket()
    {
        return $this->ticket;
    }

    public function getSenderName()
    {
        return $this->senderName;
    }

    public function getTicketNumber()
    {
        return $this->ticketNumber;
    }

    public function getSubject()
    {
        return $this->subject;
    }

    public function getContent()
    {
        return $this->content;
    }

    public function getAttachment()
    {
        return $this->attachment;
    }

    private function parseSender($data)
    {
        return $data['fromAddress'];
    }

    private function parseSenderName($data)
    {
        return $data['fromName'];
    }

    private function parseTicketNumber($data)
    {
        return $this->parseTicketNumberFromString($data['subject']);
    }

    private function parseTicket()
    {
        return Ticket::getByTicketNumber($this->ticketNumber);
    }

    private function parseSubject($data)
    {
        return $data['subject'];
    }

    private function parseContent($data)
    {
        $emailParser = new EmailParser();

        return $emailParser->parse($data['content'])->getVisibleText();
    }

    private function parseAttachment($data)
    {
        return $data['file'];
    }

    private function parseTicketNumberFromString($string)
    {
        for ($i = 0, $iMax = strlen($string); $i < $iMax; $i++) {
            if ($string[$i] === '#') {
                $match = substr($string, $i + 1, 6);
                if (is_numeric($match) && strlen($match) === 6) {
                    return (int)$match;
                }
            }
        }

        return null;
    }
}
