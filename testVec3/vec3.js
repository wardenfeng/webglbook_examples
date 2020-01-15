var Vec3 = /** @class */ (function () {
    function Vec3() {
        this.x = 1;
        this.y = 1;
        this.z = 1;
    }
    return Vec3;
}());
var Vector3 = /** @class */ (function () {
    function Vector3() {
        this.x = 1;
        this.y = 1;
        this.z = 1;
    }
    Vector3.prototype.add = function (vec3) {
        this.x += vec3.x;
        this.y += vec3.y;
        this.z += vec3.z;
    };
    Vector3.prototype.sub = function (vec3) {
        this.x -= vec3.x;
        this.y -= vec3.y;
        this.z -= vec3.z;
    };
    return Vector3;
}());
