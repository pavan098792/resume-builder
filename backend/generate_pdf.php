<?php
require __DIR__ . '/../vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

$options = new Options();
$options->set('isRemoteEnabled', true);
$options->set('isHtml5ParserEnabled', true);
$dompdf = new Dompdf($options);

function sanitizeInput($input) {
    return htmlspecialchars(trim($input));
}

$photoHtml = "";
if (!empty($_POST['photo_base64'])) {
    $photoHtml = "<div style='text-align: center; margin-bottom: 20px;'>
                    <img src='{$_POST['photo_base64']}' style='width:120px; height:120px; border-radius:50%;'>
                  </div>";
}

$name = sanitizeInput($_POST['name'] ?? 'John Doe');
$email = sanitizeInput($_POST['email'] ?? '');
$phone = sanitizeInput($_POST['phone'] ?? '');
$linkedin = sanitizeInput($_POST['linkedin'] ?? '');
$github = sanitizeInput($_POST['github'] ?? '');
$summary = nl2br(sanitizeInput($_POST['summary'] ?? ''));
$skills = nl2br(sanitizeInput($_POST['skills'] ?? ''));
$education = nl2br(sanitizeInput($_POST['education'] ?? ''));
$projects = nl2br(sanitizeInput($_POST['projects'] ?? ''));

$experienceHtml = "";
if (!empty($_POST['job_titles'])) {
    foreach ($_POST['job_titles'] as $index => $job_title) {
        $company = sanitizeInput($_POST['companies'][$index] ?? '');
        $duration = sanitizeInput($_POST['durations'][$index] ?? '');
        $desc = nl2br(sanitizeInput($_POST['job_descriptions'][$index] ?? ''));
        if (!empty($job_title)) {
            $experienceHtml .= "<div class='section'><h2>$job_title</h2>
                <p><strong>$company</strong> ($duration)</p>
                <p>$desc</p>
            </div><hr>";
        }
    }
}

$customHtml = "";
if (!empty($_POST['custom_section_titles'])) {
    foreach ($_POST['custom_section_titles'] as $index => $title) {
        $content = nl2br(sanitizeInput($_POST['custom_section_contents'][$index] ?? ''));
        if (!empty($title)) {
            $customHtml .= "<div class='section'><h2>$title</h2><p>$content</p></div><hr>";
        }
    }
}

$html = "
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #000; width: 100%; }
        h1 { text-align: center; font-size: 24px; }
        h2 { font-size: 18px; margin-top: 10px; }
        .section { margin-top: 20px; }
        .contact { text-align: center; font-size: 14px; }
        hr { border: 1px solid #000; margin: 15px 0; }
    </style>

    $photoHtml
    <h1>$name</h1>
    <div class='contact'>
        <p><strong>Email:</strong> $email | <strong>Phone:</strong> $phone</p>
        <p><strong>LinkedIn:</strong> $linkedin | <strong>GitHub:</strong> $github</p>
    </div>
    <hr>
    " . (!empty($summary) ? "<div class='section'><h2>Summary</h2><p>$summary</p></div><hr>" : "") . "
    " . (!empty($skills) ? "<div class='section'><h2>Skills</h2><p>$skills</p></div><hr>" : "") . "
    " . (!empty($education) ? "<div class='section'><h2>Education</h2><p>$education</p></div><hr>" : "") . "
    " . (!empty($projects) ? "<div class='section'><h2>Projects</h2><p>$projects</p></div><hr>" : "") . "
    $experienceHtml
    $customHtml
";

$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

if (isset($_POST['preview']) && $_POST['preview'] == "1") {
    header("Content-type: application/pdf");
    echo $dompdf->output();
    exit;
}

$dompdf->stream("Resume.pdf", ["Attachment" => 1]);
?>
