<?php
require __DIR__ . '/../vendor/autoload.php';


use Dompdf\Dompdf;
use Dompdf\Options;

$options = new Options();
$options->set('isRemoteEnabled', true);
$options->set('isHtml5ParserEnabled', true);
$dompdf = new Dompdf($options);

// **Fix: Handle Base64 Photo Upload for Live Preview**
$photoHtml = "";
if (!empty($_REQUEST['photo_base64'])) {
    $photoHtml = "<div style='text-align: center;'><img src='{$_REQUEST['photo_base64']}' style='width:120px; height:120px; border-radius:50%;'></div>";
}

// **Get Form Data**
$name = $_REQUEST['name'] ?? 'John Doe';
$email = $_REQUEST['email'] ?? '';
$phone = $_REQUEST['phone'] ?? '';
$linkedin = $_REQUEST['linkedin'] ?? '';
$github = $_REQUEST['github'] ?? '';
$summary = nl2br($_REQUEST['summary'] ?? '');
$skills = nl2br($_REQUEST['skills'] ?? '');
$education = nl2br($_REQUEST['education'] ?? '');
$projects = nl2br($_REQUEST['projects'] ?? '');

// **Fix: Work Experience Sections**
$experienceHtml = "";
if (!empty($_REQUEST['job_titles'])) {
    foreach ($_REQUEST['job_titles'] as $index => $job_title) {
        $company = $_REQUEST['companies'][$index] ?? '';
        $duration = $_REQUEST['durations'][$index] ?? '';
        $desc = nl2br($_REQUEST['job_descriptions'][$index] ?? '');
        if (!empty($job_title)) {
            $experienceHtml .= "<div class='section'><h2>$job_title</h2>
                <p><strong>$company</strong> ($duration)</p>
                <p>$desc</p>
            </div><hr>";
        }
    }
}

// **Fix: Custom Sections**
$customHtml = "";
if (!empty($_REQUEST['custom_section_titles'])) {
    foreach ($_REQUEST['custom_section_titles'] as $index => $title) {
        $content = nl2br($_REQUEST['custom_section_contents'][$index] ?? '');
        if (!empty($title)) {
            $customHtml .= "<div class='section'><h2>$title</h2><p>$content</p></div><hr>";
        }
    }
}

// **Fix: Generate Full-Width Live Preview**
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

// **Fix Live Preview**
if (isset($_GET['preview'])) {
    header("Content-type: application/pdf");
    echo $dompdf->output();
    exit;
}

// **Fix Final PDF Download**
$dompdf->stream("Resume.pdf", ["Attachment" => 1]);
?>
