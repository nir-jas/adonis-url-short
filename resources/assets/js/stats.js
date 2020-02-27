
new ClipboardJS('.btn-clipboard').on('success', function() {
    $('.btn-clipboard')
        .attr('data-original-title','Copied!').tooltip("_fixTitle").tooltip("show")
        .attr("title", "Copy to clipboard").tooltip("_fixTitle");
});

