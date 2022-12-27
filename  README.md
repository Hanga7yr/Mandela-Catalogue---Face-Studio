- The intention of the application is to generate a 3D face using,
a standard head model, from where the texture will be extracted from
3 images, from the front and either side.

- A drawing board will be provided, composed of different layers of canvas to archive its purpose.

- On the canvas, one will be able to draw different shapes: Rectangle, circle and ellipse.
These shapes will be drawn either with a fill or by wireframes.
Each shape has different ways to draw them, either from the corners or from the center.

- Once something is drawn, a utility will be shown to move, transform or rotate the result.

- There will be 3 inputs for each of the sides.
Once a file with the images is received, the canvas will be drawn with it pending to mask.
The masking process will be by drawing over the relevant parts of the image.
An option to save the mask of the determined side will be given.

- Once a mask has been selected, the UVMap will be shown and the extra utility will be shown.
The result will be saved but not appended into the UVMap.
Changes to the UVMap will be live and be seen on the 3D viewer.

- An option to upload a completed UVMap will be given, marking which sides were filled.
These sides will be locked out.
An option to download the UVMap will be given, it will give out the completed UVMap,
with the sides available.

- Each file input will contain the determined input and a button marked as "Process".
The button will be disabled until a valid file is given.
As the file is processed, a view of the original file will be given.
This file view will have a button allowing to, once again, draw the image for the given side,
in case it was needed to clear the canvas.

- Once a shape is selected, the determined ways to draw will be enabled, the other disabled.

- The extra utility will select a rectangular area around the selected object.
The rectangle will be divided on 9 points, marking the way it can be moved.
An additional point will be place, slightly over the top allowing to rotate it.
The center one will make it move. The side will stretch. The corners will skew.
- The corners can move everywhere, the sides will contort but only
move to the determined side, moving the corners if needed.

- A menu will be provided with an offcanvas.
An option to open it will be given, as well as close.
The menu will consist of 2 items, in form of an accordion.
A Controls where the control of with the 3D Viewer and Canvas will be proved.
A Credits part, where the credits of the different assets will be given.

- Controls will consist of sections.
- One for the 3D viewer, where it will be explained how to move within it.
One for the usage of Face Studio.
One for the input of the sides face image.
One for the different canvas options.
One for the canvas toggles. View UVMap, View Side (once selected), View 3D Viewer, Clear canvas.
One for the Image Viewer.


- The application will be made with a series of helpers.
- A canvas event helper: It governs the event produced within the canvas.
Determines when and where should an action be passed to other helpers.
- A canvas shape helper: It determines how to draw the different shapes,
based on the actions received from the event helper.
- A UI Helper: Compacts the creation of UI element from JS.
- A UI Event Helper: In charge of managing the different callbacks and passing them to the receivers.
- UV Helper: Gathers data to form the complete UVMap.
- Viewer Helper: Eases the process of setting and controlling the 3D Viewer.
- App: In charge of intertwining all the functionalities into one.