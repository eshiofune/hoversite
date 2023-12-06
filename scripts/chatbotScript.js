$('.chat-box').css({ "visibility": "visible" });
$('.chat-button').css({ "display": "none" });

$('.chat-button').on('click', function () {
    $('.chat-button').css({ "display": "none" });

    $('.chat-box').css({ "visibility": "visible" });
});

$(document).on("keypress", "input", async function (e) {
    if (e.which == 13) {
        const message = $("#userMessage").val();
        $("#userMessage").val("");
        await sendUserMessage(message);
    }
});

$(".send").on("click", async function () {
    const message = $("#userMessage").val();
    $("#userMessage").val("");
    await sendUserMessage(message);
});
//# sourceURL=pen.js