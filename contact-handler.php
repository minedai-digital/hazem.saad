<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'الرجاء ملء جميع الحقول المطلوبة']);
        exit;
    }
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'عنوان البريد الإلكتروني غير صحيح']);
        exit;
    }
    
    // Load existing messages
    $messagesFile = 'data/messages.json';
    $messages = [];
    
    if (file_exists($messagesFile)) {
        $messagesContent = file_get_contents($messagesFile);
        $messages = json_decode($messagesContent, true) ?: [];
    }
    
    // Generate new ID
    $ids = array_column($messages, 'id');
    $newId = empty($ids) ? 1 : max($ids) + 1;
    
    // Create new message
    $newMessage = [
        'id' => $newId,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'subject' => $subject ?: 'رسالة جديدة',
        'message' => $message,
        'status' => 'unread',
        'dateReceived' => date('Y-m-d\TH:i:s'),
        'priority' => 'normal'
    ];
    
    // Add to messages array
    $messages[] = $newMessage;
    
    // Save to file
    if (file_put_contents($messagesFile, json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode(['success' => true, 'message' => 'تم إرسال الرسالة بنجاح']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'حدث خطأ في حفظ الرسالة']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'طريقة الطلب غير مدعومة']);
}
?>