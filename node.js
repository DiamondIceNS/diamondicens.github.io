document.addEventListener("DOMContentLoaded", function (event) {
    const m4 = twgl.m4;
    const gl = document.getElementById("node-canvas").getContext("webgl");
    const programInfo = twgl.createProgramInfo(gl, ["vertex", "fragment"]);
    const T_WIDTH = 256;
    const T_HEIGHT = 256;
    const CORE_BUFFER_INFO = twgl.primitives.createXYQuadBufferInfo(gl, 1, 0, 0);
    const ASPECTS = [
        "aer",          "terra",    "ignis",        "aqua",       "ordo",     "perditio",
        "vacuos",       "lux",      "tempestas",    "motus",      "gelum",    "vitreus",
        "victus",       "venenum",  "potentia",     "permutatio", "metallum", "mortuus",
        "volatus",      "tenebrae", "spiritus",     "sano",       "iter",     "alienis",
        "praecantatio", "auram",    "vitium",       "limus",      "herba",    "arbor",
        "bestia",       "corpus",   "exanimis",     "cognitio",   "sensus",   "humanus",
        "messis",       "perfodio", "instrumentum", "meto",       "telum",    "tutamen",
        "fames",        "lucrum",   "fabrico",      "pannus",     "machina",  "vinculum"
    ];
    const ASPECT_COLORS = {
        "aer":          { color: 0xffff7e, blend: gl.ONE },
        "terra":        { color: 0x56c000, blend: gl.ONE },
        "ignis":        { color: 0xff5a01, blend: gl.ONE },
        "aqua":         { color: 0x3cd4fc, blend: gl.ONE },
        "ordo":         { color: 0xd5d4ec, blend: gl.ONE },
        "perditio":     { color: 0x404040, blend: gl.ONE_MINUS_SRC_ALPHA },
        "vacuos":       { color: 0x888888, blend: gl.ONE_MINUS_SRC_ALPHA },
        "lux":          { color: 0xfff663, blend: gl.ONE },
        "tempestas":    { color: 0xffffff, blend: gl.ONE },
        "motus":        { color: 0xcdccf4, blend: gl.ONE },
        "gelum":        { color: 0xe1ffff, blend: gl.ONE },
        "vitreus":      { color: 0x80ffff, blend: gl.ONE },
        "victus":       { color: 0xde0005, blend: gl.ONE },
        "venenum":      { color: 0x89f000, blend: gl.ONE },
        "potentia":     { color: 0xc0ffff, blend: gl.ONE },
        "permutatio":   { color: 0x578357, blend: gl.ONE },
        "metallum":     { color: 0xb5b5cd, blend: gl.ONE },
        "mortuus":      { color: 0x887788, blend: gl.ONE },
        "volatus":      { color: 0xe7e7d7, blend: gl.ONE },
        "tenebrae":     { color: 0x222222, blend: gl.ONE },
        "spiritus":     { color: 0xebebfb, blend: gl.ONE },
        "sano":         { color: 0xff2f34, blend: gl.ONE },
        "iter":         { color: 0xe0585b, blend: gl.ONE },
        "alienis":      { color: 0x805080, blend: gl.ONE },
        "praecantatio": { color: 0x9700c0, blend: gl.ONE },
        "auram":        { color: 0xffc0ff, blend: gl.ONE },
        "vitium":       { color: 0x800080, blend: gl.ONE },
        "limus":        { color: 0x01f800, blend: gl.ONE },
        "herba":        { color: 0x01ac00, blend: gl.ONE },
        "arbor":        { color: 0x876531, blend: gl.ONE },
        "bestia":       { color: 0x9f6409, blend: gl.ONE },
        "corpus":       { color: 0xee478d, blend: gl.ONE },
        "exanimis":     { color: 0x3a4000, blend: gl.ONE },
        "cognitio":     { color: 0xffc2b3, blend: gl.ONE },
        "sensus":       { color: 0x0fd9ff, blend: gl.ONE },
        "humanus":      { color: 0xffd7c0, blend: gl.ONE },
        "messis":       { color: 0xe1b371, blend: gl.ONE },
        "perfodio":     { color: 0xdcd2d8, blend: gl.ONE },
        "instrumentum": { color: 0x4040ee, blend: gl.ONE },
        "meto":         { color: 0xeead82, blend: gl.ONE },
        "telum":        { color: 0xc05050, blend: gl.ONE },
        "tutamen":      { color: 0x00c0c0, blend: gl.ONE },
        "fames":        { color: 0x9a0305, blend: gl.ONE },
        "lucrum":       { color: 0xe6be44, blend: gl.ONE },
        "fabrico":      { color: 0x809d80, blend: gl.ONE },
        "pannus":       { color: 0xeaeac2, blend: gl.ONE },
        "machina":      { color: 0x8080a0, blend: gl.ONE },
        "vinculum":     { color: 0x9a8080, blend: gl.ONE }
    };
    const ASPECT_HALOS = [];
    const TEX = twgl.createTexture(gl, {
        src: "nodes.png"
    });
    const HALO_UNIFORMS = {
        matrix: twgl.m4.identity(),
        textureMatrix: twgl.m4.identity(),
        texture: TEX,
        aspectColor: [0xFF/256, 0xFF/256, 0x7E/256, 0.5]
    };
    const CORE_UNIFORMS = {
        matrix: twgl.m4.identity(),
        textureMatrix: twgl.m4.identity(),
        texture: TEX,
        aspectColor: [1, 1, 1, 1]
    };


    function onChangeAspectType(event) {
        let container = this.parentNode;
        let i = [...container.parentNode.children].findIndex(x => x === container);
        ASPECT_HALOS[i].aspect = this.value;
    };
    
    function onChangeAspectAmount(event) {
        let container = this.parentNode.parentNode;
        let i = [...container.parentNode.children].findIndex(x => x === container);
        ASPECT_HALOS[i].count = Number(this.value);
    }
    
    function addAspect() {
        let aspectContainerList = document.getElementById("aspects");
        let aspectContainer = document.createElement("div");
        let aspectSelect = document.createElement("select");
        let aspectAmount = document.createElement("input");
        let aspectAmountLabel = document.createElement("label");
    
        /** @type {String[]} */
        let currentAspects = ASPECT_HALOS.reduce((carry, x) => { carry.push(x.aspect); return carry; }, []);
        let defaultSelected = null;
        for (let a of ASPECTS) {
            let o = document.createElement("option");
            o.text = a.charAt(0).toUpperCase() + a.substr(1);
            o.value = a;
            if (!currentAspects.includes(a) && defaultSelected === null) {
                o.selected = true;
                defaultSelected = a;
            } 
            aspectSelect.appendChild(o);
        }
    
        aspectContainer.classList.add("aspect");
        aspectSelect.classList.add("aspect-type");
        aspectAmount.classList.add("aspect-amount");
        aspectAmount.type = "number";
        aspectAmount.value = "25";
        aspectAmount.min = 1;
        aspectAmount.step = 1;
        aspectAmountLabel.appendChild(document.createTextNode("Vis count: "));
        aspectAmountLabel.appendChild(aspectAmount);
        aspectContainer.appendChild(aspectSelect);
        aspectContainer.appendChild(aspectAmountLabel);
        aspectContainerList.appendChild(aspectContainer);
    
        aspectSelect.addEventListener("change", onChangeAspectType);
        aspectAmount.addEventListener("change", onChangeAspectAmount);
    
        ASPECT_HALOS.push({
            aspect: defaultSelected,
            count: 25,
            bufferInfo: twgl.primitives.createXYQuadBufferInfo(gl, 1, 0, 0)
        });
    }
    
    function getVisTotal() {
        return ASPECT_HALOS.reduce((carry, x) => x.count + carry, 0);
    }
    
    function render(time) {
        let frame = Math.floor(time / 48) % 32;
        let timeTicks = time / 5;
    
        twgl.resizeCanvasToDisplaySize(gl.canvas);
        gl.useProgram(programInfo.program);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.522, 0.659, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    
        gl.depthMask(false);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
    
        let scale = 1;
        let angle = 0;
        for (let [i, halo] of ASPECT_HALOS.slice().reverse().entries()) {
            scale = (Math.sin(timeTicks / (14.0 - i) / 10) + 2.0) * 0.25;
            scale = 0.2 + scale * (halo.count / 50);
            angle = Math.PI * 2 * (timeTicks % (5000 + 500 * i)) / (5000 + (500 * i));
            
            const mat = HALO_UNIFORMS.matrix;
            m4.identity(mat);
            m4.ortho(0, gl.canvas.clientWidth, gl.canvas.clientHeight, 0, -1, 1, mat);
            m4.translate(mat, [(gl.canvas.clientWidth) / 2, (gl.canvas.clientHeight) / 2, 0], mat);
            m4.scale(mat, [512, 512, 1], mat);
            m4.scale(mat, [scale, scale, 1], mat);
            m4.rotateZ(mat, angle, mat);
    
            const tmat = HALO_UNIFORMS.textureMatrix;
            m4.identity(tmat);
            m4.translate(tmat, [frame * 1/32 + 1/64, 1/64, 0], tmat);
            m4.scale(tmat, [0.03125, 0.03125, 1], tmat);
    
            twgl.setBuffersAndAttributes(gl, programInfo, halo.bufferInfo);
            let alpha = 0.75;
            HALO_UNIFORMS.aspectColor = getColor(halo.aspect, alpha);
            twgl.setUniforms(programInfo, HALO_UNIFORMS);
            gl.blendFunc(gl.SRC_ALPHA, ASPECT_COLORS[halo.aspect].blend);
            twgl.drawBufferInfo(gl, halo.bufferInfo);
        }
    
    
        scale = 0.1 + (getVisTotal() / ASPECT_HALOS.length) / 150.0;
        const mat = CORE_UNIFORMS.matrix;
        m4.identity(mat);
        m4.ortho(0, gl.canvas.clientWidth, gl.canvas.clientHeight, 0, -1, 1, mat);
        m4.translate(mat, [(gl.canvas.clientWidth) / 2, (gl.canvas.clientHeight) / 2, 0], mat);
        m4.scale(mat, [512, 512, 1], mat);
        m4.scale(mat, [scale, scale, 1], mat);
        m4.rotateZ(mat, angle, mat);
    
        const tmat = CORE_UNIFORMS.textureMatrix;
        m4.identity(tmat);
        m4.translate(tmat, [frame * 1/32 + 1/64, 3/64, 0], tmat);
        m4.scale(tmat, [0.03125, 0.03125, 1], tmat);
    
        twgl.setBuffersAndAttributes(gl, programInfo, CORE_BUFFER_INFO);
        let alpha = 0.5;
        CORE_UNIFORMS.aspectColor = [1, 1, 1, alpha];
        twgl.setUniforms(programInfo, CORE_UNIFORMS);
        twgl.drawBufferInfo(gl, CORE_BUFFER_INFO);
    
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    
    function getColor(aspect, alpha) {
        let aspectColor = ASPECT_COLORS[aspect].color;
        aspectColor >>>= 0;
        var b = (aspectColor & 0xFF) / 255,
            g = ((aspectColor & 0xFF00) >>> 8) / 255,
            r = ((aspectColor & 0xFF0000) >>> 16) / 255;
        return [r, g, b, alpha];
    }

    document.getElementById("btn-add-aspect").addEventListener("click", addAspect);
    addAspect();
});