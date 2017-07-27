var onRun = function(context) {
    // reference the sketch document
    var doc = context.document;
    var page = doc.currentPage();
    var artboards = page.artboards();
    var selection = context.selection;
    var artboardsInOrder = [];

    // check if user selected something
    if (selection.count() == 0) {
        doc.showMessage("Please select artboards.");
        return;
    }

    // check if every layer selected is an artboard
    var selectedArtboards = selection.every(function(layer){
        return layer.isMemberOfClass(MSArtboardGroup)
    });

    if (selectedArtboards) {
        var xPos = [];
        var yPos = [];

        // find artboards x and y positions
        for(var i=0; i<selection.count(); i++) {
            var layer = selection[i];
            xPos.push(layer.frame().x());
            yPos.push(layer.frame().y());
            xPos.sort(function(a, b) { return a - b; });
            yPos.sort(function(a, b) { return a - b; });
        }

        // get unique x, y positions of artboards
        var yPosUnique = yPos.filter(onlyUnique);
        var xPosUnique = xPos.filter(onlyUnique);

        // for each yPos (from smallest to largest), create artboards array
        // based on the order of their xPos(from smallest to largest)
        for(var u=0; u<yPosUnique.length; u++) {
            for(var r=0; r<xPosUnique.length; r++) {
                for(var i=0; i<selection.count(); i++) {
                    var layer = selection[i];
                    var layerX = layer.frame().x();
                    var layerY = layer.frame().y();

                    if(layerY === yPosUnique[u]) {
                        if(layerX === xPosUnique[r]) {
                            artboardsInOrder.push(layer);
                        }
                    }

                }
            }
        }
        
        //change the artboards order in layer list based on artboards layout
        // TODO: change only the artboards selected in layer lists not removing other layers
        page.layers = artboardsInOrder;
        doc.showMessage("Artboards were reordered on layer list.");
    }
    else {
        doc.showMessage("Only artboards allowed. Please only select artboards!.");
        return;
    }
}


var onlyUnique = function(value, index, self) {
    return self.indexOf(value) === index;
}
