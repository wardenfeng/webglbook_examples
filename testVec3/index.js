

var obj = {
  num: 10000000,

  createVec3: function ()
  {
    var num = this.num;
    var arr = [];
    for (var i = 0; i < num; i++)
    {
      arr.push(new Vec3());
    }
    window.arr = arr;
  },
  clearVec3: function ()
  {
    window.arr = null;
  },

  createVect3: function ()
  {
    var num = this.num;
    var arr = [];
    for (var i = 0; i < num; i++)
    {
      arr.push(new Vect3());
    }
    window.arr = arr;
  },
  clearVector3: function ()
  {
    window.arr = null;
  },

  createVector3: function ()
  {
    var num = this.num;
    var arr = [];
    for (var i = 0; i < num; i++)
    {
      arr.push(new Vector3());
    }
    window.arr = arr;
  },
  clearVector3: function ()
  {
    window.arr = null;
  },
};

var gui = new dat.GUI();
gui.add(obj, 'num');
gui.add(obj, 'createVec3');
gui.add(obj, 'clearVec3');
gui.add(obj, 'createVect3');
gui.add(obj, 'clearVec3');
gui.add(obj, 'createVector3');
gui.add(obj, 'clearVector3');