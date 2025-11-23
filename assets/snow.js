(function (window) {
    'use strict';

    if (!window || window.__HanSnowInitialized) {
        return;
    }

    function resolveDensity(config) {
        var density = parseInt(config && config.density, 10);
        if (!isFinite(density)) {
            density = 66;
        }
        var min = config && config.minDensity ? parseInt(config.minDensity, 10) : 10;
        var max = config && config.maxDensity ? parseInt(config.maxDensity, 10) : 300;
        if (!isFinite(min)) {
            min = 10;
        }
        if (!isFinite(max)) {
            max = 300;
        }
        if (min > max) {
            var tmp = min;
            min = max;
            max = tmp;
        }
        if (density < min) {
            density = min;
        }
        if (density > max) {
            density = max;
        }
        return density;
    }

    function injectBaseNodes() {
        var style = document.getElementById('hanApi-snow-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'hanApi-snow-style';
            style.textContent = '#hanApi-Snow{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;pointer-events:none;}';
            document.head.appendChild(style);
        }

        var canvas = document.getElementById('hanApi-Snow');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'hanApi-Snow';
            document.body.appendChild(canvas);
        }

        return canvas;
    }

    function boot() {
        window.__HanSnowInitialized = true;
        var cfg = window.SnowControlConfig || {};
        var flakeCount = resolveDensity(cfg);

        var canvas = injectBaseNodes();
        var ctx = canvas.getContext('2d');
        var flakes = [];
        var mX = -100;
        var mY = -100;

        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function reset(flake) {
            flake.x = Math.floor(Math.random() * canvas.width);
            flake.y = 0;
            flake.size = Math.random() * 3 + 2;
            flake.speed = Math.random() * 1 + 0.2;
            flake.velY = flake.speed;
            flake.velX = 0;
            flake.opacity = Math.random() * 0.5 + 0.3;
        }

        function createFlake() {
            var x = Math.floor(Math.random() * canvas.width);
            var y = Math.floor(Math.random() * canvas.height);
            var size = Math.random() * 3 + 2;
            var speed = Math.random() * 1 + 0.2;
            var opacity = Math.random() * 0.5 + 0.3;
            return {
                speed: speed,
                velY: speed,
                velX: 0,
                x: x,
                y: y,
                size: size,
                stepSize: Math.random() / 30,
                step: 0,
                opacity: opacity
            };
        }

        function snow() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < flakeCount; i++) {
                var flake = flakes[i];
                var x = mX;
                var y = mY;
                var minDist = 150;
                var x2 = flake.x;
                var y2 = flake.y;
                var dx = x2 - x;
                var dy = y2 - y;
                var dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < minDist && dist > 0) {
                    var force = minDist / (dist * dist);
                    var xcomp = (x - x2) / dist;
                    var ycomp = (y - y2) / dist;
                    var deltaV = force / 2;
                    flake.velX -= deltaV * xcomp;
                    flake.velY -= deltaV * ycomp;
                } else {
                    flake.velX *= 0.98;
                    if (flake.velY <= flake.speed) {
                        flake.velY = flake.speed;
                    }
                    flake.velX += Math.cos(flake.step += 0.05) * flake.stepSize;
                }

                ctx.fillStyle = 'rgba(255,255,255,' + flake.opacity + ')';
                flake.y += flake.velY;
                flake.x += flake.velX;

                if (flake.y >= canvas.height || flake.y <= 0) {
                    reset(flake);
                }

                if (flake.x >= canvas.width || flake.x <= 0) {
                    reset(flake);
                }

                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
                ctx.fill();
            }

            window.requestAnimationFrame(snow);
        }

        function init() {
            resizeCanvas();
            flakes = [];
            for (var i = 0; i < flakeCount; i++) {
                flakes.push(createFlake());
            }
            snow();
        }

        document.addEventListener('mousemove', function (e) {
            mX = e.clientX;
            mY = e.clientY;
        });

        window.addEventListener('resize', resizeCanvas);

        console.log('%c 韩小韩 API x SnowControl %c', 'color:#fadfa3;background:#030307;padding:5px;', 'background:#fadfa3;padding:5px;');
        init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})(window);
