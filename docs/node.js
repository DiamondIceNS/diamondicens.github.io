document.addEventListener("DOMContentLoaded", function (event) {
    const bgGL = document.getElementById("background-canvas").getContext("webgl");
    const bgProgramInfo = twgl.createProgramInfo(bgGL, ["vertex", "fragment"]);

    const nodeGL = document.getElementById("node-canvas").getContext("webgl");
    const nodeProgramInfo = twgl.createProgramInfo(nodeGL, ["vertex", "fragment"]);

    const CORE_BUFFER_INFO = twgl.primitives.createXYQuadBufferInfo(nodeGL, 1, 0, 0);
    const BACKGROUND_BUFFER_INFO_BLEND = twgl.primitives.createXYQuadBufferInfo(nodeGL, 1, 0, 0);
    const BACKGROUND_BUFFER_INFO_NO_BLEND = twgl.primitives.createXYQuadBufferInfo(bgGL, 1, 0, 0);

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
        "aer":          { color: 0xffff7e, blend: nodeGL.ONE },
        "terra":        { color: 0x56c000, blend: nodeGL.ONE },
        "ignis":        { color: 0xff5a01, blend: nodeGL.ONE },
        "aqua":         { color: 0x3cd4fc, blend: nodeGL.ONE },
        "ordo":         { color: 0xd5d4ec, blend: nodeGL.ONE },
        "perditio":     { color: 0x404040, blend: nodeGL.ONE_MINUS_SRC_ALPHA },
        "vacuos":       { color: 0x888888, blend: nodeGL.ONE_MINUS_SRC_ALPHA },
        "lux":          { color: 0xfff663, blend: nodeGL.ONE },
        "tempestas":    { color: 0xffffff, blend: nodeGL.ONE },
        "motus":        { color: 0xcdccf4, blend: nodeGL.ONE },
        "gelum":        { color: 0xe1ffff, blend: nodeGL.ONE },
        "vitreus":      { color: 0x80ffff, blend: nodeGL.ONE },
        "victus":       { color: 0xde0005, blend: nodeGL.ONE },
        "venenum":      { color: 0x89f000, blend: nodeGL.ONE },
        "potentia":     { color: 0xc0ffff, blend: nodeGL.ONE },
        "permutatio":   { color: 0x578357, blend: nodeGL.ONE },
        "metallum":     { color: 0xb5b5cd, blend: nodeGL.ONE },
        "mortuus":      { color: 0x887788, blend: nodeGL.ONE },
        "volatus":      { color: 0xe7e7d7, blend: nodeGL.ONE },
        "tenebrae":     { color: 0x222222, blend: nodeGL.ONE },
        "spiritus":     { color: 0xebebfb, blend: nodeGL.ONE },
        "sano":         { color: 0xff2f34, blend: nodeGL.ONE },
        "iter":         { color: 0xe0585b, blend: nodeGL.ONE },
        "alienis":      { color: 0x805080, blend: nodeGL.ONE },
        "praecantatio": { color: 0x9700c0, blend: nodeGL.ONE },
        "auram":        { color: 0xffc0ff, blend: nodeGL.ONE },
        "vitium":       { color: 0x800080, blend: nodeGL.ONE },
        "limus":        { color: 0x01f800, blend: nodeGL.ONE },
        "herba":        { color: 0x01ac00, blend: nodeGL.ONE },
        "arbor":        { color: 0x876531, blend: nodeGL.ONE },
        "bestia":       { color: 0x9f6409, blend: nodeGL.ONE },
        "corpus":       { color: 0xee478d, blend: nodeGL.ONE },
        "exanimis":     { color: 0x3a4000, blend: nodeGL.ONE },
        "cognitio":     { color: 0xffc2b3, blend: nodeGL.ONE },
        "sensus":       { color: 0x0fd9ff, blend: nodeGL.ONE },
        "humanus":      { color: 0xffd7c0, blend: nodeGL.ONE },
        "messis":       { color: 0xe1b371, blend: nodeGL.ONE },
        "perfodio":     { color: 0xdcd2d8, blend: nodeGL.ONE },
        "instrumentum": { color: 0x4040ee, blend: nodeGL.ONE },
        "meto":         { color: 0xeead82, blend: nodeGL.ONE },
        "telum":        { color: 0xc05050, blend: nodeGL.ONE },
        "tutamen":      { color: 0x00c0c0, blend: nodeGL.ONE },
        "fames":        { color: 0x9a0305, blend: nodeGL.ONE },
        "lucrum":       { color: 0xe6be44, blend: nodeGL.ONE },
        "fabrico":      { color: 0x809d80, blend: nodeGL.ONE },
        "pannus":       { color: 0xeaeac2, blend: nodeGL.ONE },
        "machina":      { color: 0x8080a0, blend: nodeGL.ONE },
        "vinculum":     { color: 0x9a8080, blend: nodeGL.ONE },
        //"granum":       { color: 0xeea16e, blend: gl.ONE },
        //"saxum":        { color: 0x808080, blend: gl.ONE },

        //"infernus":     { color: 0xff0000, blend: gl.ONE },
        //"superbia":     { color: 0x9639ff, blend: gl.ONE },
        //"gula":         { color: 0xd59c46, blend: gl.ONE },
        //"invidia":      { color: 0x00ba00, blend: gl.ONE },
        //"desidia":      { color: 0x6e6e6e, blend: gl.ONE },
        //"ira":          { color: 0x870404, blend: gl.ONE },
        //"luxuria":      { color: 0xffc1ce, blend: gl.ONE },

        //"tempus":       { color: 0xb68cff, blend: gl.ONE },
        
        //"sanctus":      { color: 0x, blend: gl.ONE },

        //"excubitor":     { color: 0x3cd4fc, blend: gl.ONE },
    };
    const ASPECT_HALOS = [];

    const TEX = twgl.createTexture(nodeGL, {
        src: "assets/nodes.png"
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
        aspectColor: [0, 0, 0, 1]
    };
    const BACKGROUND_UNIFORMS_BLEND = {
        matrix: twgl.m4.identity(),
        textureMatrix: twgl.m4.identity(),
        texture: twgl.createTexture(nodeGL, { src: 'assets/bg.png' }),
        aspectColor: [1, 1, 1, 1]
    };
    const BACKGROUND_UNIFORMS_NO_BLEND = {
        matrix: twgl.m4.identity(),
        textureMatrix: twgl.m4.identity(),
        texture: twgl.createTexture(bgGL, { src: 'assets/bg.png' }),
        aspectColor: [1, 1, 1, 1]
    };

    let BRIGHTNESS = 0;
    let CORE_TYPE = 0;
    let IS_VISIBILITY_MODE_ON = false;

    function onChangeAspectType(event) {
    };
    
    function onChangeAspectAmount(event) {
        let container = this.parentNode;
        let i = [...container.parentNode.children].findIndex(x => x === container);
        ASPECT_HALOS[i].count = Number(this.value);
    }
    
    function addAspect() {
        const aspectContainerList = document.getElementById("aspects");
        const aspectContainer = document.createElement("div");
        const aspectSelect = document.createElement("select");
        const aspectAmount = document.createElement("input");
        const removeAspectBtn = document.createElement("div");
        const aspectSelectDiv = document.createElement("div");
    
        /** @type {String[]} */
        let currentAspects = ASPECT_HALOS.reduce((carry, x) => { carry.push(x.aspect); return carry; }, []);
        let defaultSelected = null;
        if (currentAspects.length === ASPECTS.length) {
            return;
        }
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

        const xmlns = 'http://www.w3.org/2000/svg';
        const a = document.createElement("div");
        const aa = document.createElement("div");
        const aspectIconDiv = document.createElement("div");
        const aspectIcon = document.createElementNS(xmlns, 'svg');
        const aspectIconBack = document.createElement("img");
        aspectIconDiv.appendChild(aspectIcon);
        aspectIconDiv.appendChild(aspectIconBack);
        aspectIconDiv.classList.add("aspect-icon");
        aspectIconBack.src = "assets/back.svg";
        aspectIconBack.classList.add("aspect-icon-back");
        const aspectIconUse = document.createElementNS(xmlns, 'use');
        aspectIconUse.setAttributeNS(null, 'href', `#${defaultSelected}`);
        aspectIcon.appendChild(aspectIconUse);
        aspectIcon.setAttributeNS(xmlns, 'viewBox', '0 0 512 512');
        aspectIcon.classList.add("aspect-icon-fg");
        a.appendChild(aspectIconDiv);
        a.appendChild(aa);
        a.setAttribute("class", "select-selected");
        aa.classList.add("aspect-name");
        aa.innerHTML = aspectSelect.options[aspectSelect.selectedIndex].innerHTML;
        aspectSelectDiv.appendChild(a);
        a.addEventListener("click", closeAllSelect);

        const b = document.createElement("div");
        const bWrapper = document.createElement("div");
        b.classList.add("select-items", "select-hide");
        bWrapper.classList.add("select-items-wrapper");
        for (const aa of aspectSelect.options) {
            const c = document.createElement("div");
            const ca = document.createElement("div");
            const cIconDiv = document.createElement("div");
            const cIconFg = document.createElementNS(xmlns, 'svg');
            const cIconBg = document.createElement("img");
            cIconDiv.classList.add("aspect-icon");
            cIconFg.classList.add("aspect-icon-fg");
            cIconBg.classList.add("aspect-icon-back");
            const cIconFgUse = document.createElementNS(xmlns, 'use');
            cIconFgUse.setAttributeNS(null, 'href', `#${aa.value}`);
            cIconFg.setAttributeNS(xmlns, 'viewBox', '0 0 512 512');
            cIconFg.appendChild(cIconFgUse);
            cIconBg.src = "assets/back.svg";
            ca.classList.add("aspect-name");
            ca.innerHTML = aa.innerHTML;
            cIconDiv.appendChild(cIconFg);
            cIconDiv.appendChild(cIconBg);
            c.appendChild(cIconDiv);
            c.appendChild(ca);
            c.addEventListener("click", clickSelectOption);
            b.appendChild(c);
        }
        aspectSelectDiv.appendChild(bWrapper);
        bWrapper.appendChild(b);
    
        aspectSelectDiv.classList.add("div-aspect-select");
        aspectContainer.classList.add("aspect");
        aspectSelect.classList.add("aspect-type");
        aspectAmount.classList.add("aspect-amount");
        aspectAmount.type = "number";
        aspectAmount.value = "25";
        aspectAmount.min = 1;
        aspectAmount.step = 1;
        removeAspectBtn.classList.add("remove-aspect");
        removeAspectBtn.innerHTML = "&times;";
        aspectSelectDiv.appendChild(aspectSelect)
        aspectContainer.appendChild(aspectSelectDiv);
        aspectContainer.appendChild(aspectAmount);
        aspectContainer.appendChild(removeAspectBtn);
        aspectContainerList.appendChild(aspectContainer);
    
        aspectSelect.addEventListener("change", onChangeAspectType);
        aspectAmount.addEventListener("change", onChangeAspectAmount);
        removeAspectBtn.addEventListener("click", removeAspect);
    
        ASPECT_HALOS.push({
            aspect: defaultSelected,
            count: 25,
            bufferInfo: twgl.primitives.createXYQuadBufferInfo(nodeGL, 1, 0, 0)
        });
    }

    function removeAspect() {
        const aspectElement = this.parentNode;
        const i = [...aspectElement.parentNode.children].findIndex(x => x === aspectElement);
        ASPECT_HALOS.splice(i, 1);
        aspectElement.parentNode.removeChild(aspectElement);
    }

    /** Click event handler for an aspect list custom select dropdown option. */
    function clickSelectOption() {
        const xmlns = 'http://www.w3.org/2000/svg';
        const selectElement = this.parentNode.parentNode.parentNode.querySelector("select");
        const selectedOptionElement = this.parentNode.parentNode.previousSibling;
        const value = this.querySelector(".aspect-name").innerHTML;
        for (let i = 0; i < selectElement.length; i++) {
            if (selectElement.options[i].innerHTML === value) {
                selectElement.selectedIndex = i;
                selectedOptionElement.querySelector(".aspect-name").innerHTML = value;
                const useElem = selectedOptionElement.querySelector('.aspect-icon-fg').children[0];
                useElem.setAttributeNS(null, 'href', `#${selectElement.value}`);
                useElem.setAttributeNS(xmlns, 'x', '0');
                useElem.setAttributeNS(xmlns, 'y', '0');
                let container = this.parentNode.parentNode.parentNode.parentNode;
                let ii = [...container.parentNode.children].findIndex(x => x === container);
                ASPECT_HALOS[ii].aspect = selectElement.value;
                for (const x of this.parentNode.children) x.classList.remove("same-as-selected");
                this.classList.add("same-as-selected");
            }
        }
        selectedOptionElement.click();
    }

    /** Click event handler for closing an aspect list select */
    function closeAllSelect(event) {
        event.stopPropagation();

        const arrNo = [];
        const x = document.getElementsByClassName("select-items");
        const y = document.getElementsByClassName("select-selected");
        for (let i = 0; i < y.length; i++) {
            if (this == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }
        for (let i = 0; i < x.length; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
        this.nextSibling.firstChild.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    }
    
    function getVisTotal() {
        return ASPECT_HALOS.reduce((carry, x) => x.count + carry, 0);
    }

    function resetCanvas(gl, programInfo) {
        twgl.resizeCanvasToDisplaySize(gl.canvas);
        gl.useProgram(programInfo.program);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.depthMask(false);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
    }
    
    function render(time) {
        let frame = Math.floor(time / 48) % 32;
        let timeTicks = time / 5;

        resetCanvas(bgGL, bgProgramInfo);
        resetCanvas(nodeGL, nodeProgramInfo);

        // Draw background
        if (IS_VISIBILITY_MODE_ON) {
            const bgmat = BACKGROUND_UNIFORMS_NO_BLEND.matrix;
            twgl.m4.ortho(0, bgGL.canvas.clientWidth, bgGL.canvas.clientHeight, 0, -1, 1, bgmat);
            twgl.m4.translate(bgmat, [(bgGL.canvas.clientWidth) / 2, (bgGL.canvas.clientHeight) / 2, 0], bgmat);
            twgl.m4.scale(bgmat, [1920, 1052, 1], bgmat);
            twgl.m4.scale(bgmat, [1, 1, 1], bgmat);
            const bgTmat = BACKGROUND_UNIFORMS_NO_BLEND.textureMatrix;
            twgl.m4.identity(bgTmat);
            twgl.m4.translate(bgTmat, [0.5, 0.5, 0], bgTmat);
            twgl.setBuffersAndAttributes(bgGL, bgProgramInfo, BACKGROUND_BUFFER_INFO_NO_BLEND);
            twgl.setUniforms(bgProgramInfo, BACKGROUND_UNIFORMS_NO_BLEND);
            twgl.drawBufferInfo(bgGL, BACKGROUND_BUFFER_INFO_NO_BLEND);
        } else {
            const bgmat = BACKGROUND_UNIFORMS_BLEND.matrix;
            twgl.m4.ortho(0, nodeGL.canvas.clientWidth, nodeGL.canvas.clientHeight, 0, -1, 1, bgmat);
            twgl.m4.translate(bgmat, [(nodeGL.canvas.clientWidth) / 2, (nodeGL.canvas.clientHeight) / 2, 0], bgmat);
            twgl.m4.scale(bgmat, [1920, 1052, 1], bgmat);
            twgl.m4.scale(bgmat, [1, 1, 1], bgmat);
            const bgTmat = BACKGROUND_UNIFORMS_BLEND.textureMatrix;
            twgl.m4.identity(bgTmat);
            twgl.m4.translate(bgTmat, [0.5, 0.5, 0], bgTmat);
            twgl.setBuffersAndAttributes(nodeGL, nodeProgramInfo, BACKGROUND_BUFFER_INFO_BLEND);
            twgl.setUniforms(nodeProgramInfo, BACKGROUND_UNIFORMS_BLEND);
            twgl.drawBufferInfo(nodeGL, BACKGROUND_BUFFER_INFO_BLEND);
        }

        let scale = 1;
        let angle = 0;
        let alpha = Math.min(1, Math.max(0, (64 - Number(document.getElementById("distance-to-node").value)) / 64));
        switch (BRIGHTNESS) {
            case 1:
                alpha *= 1.5;
                break;
            case 2:
                alpha *= 0.66;
                break;
            case 3:
                alpha *= Math.sin(timeTicks / 30) * 0.25 + 0.33;
            default:
                // no-op
        }
    
        // Draw aspect halos
        for (let [i, halo] of ASPECT_HALOS.slice().reverse().entries()) {
            scale = (Math.sin(timeTicks / (14.0 - i) / 10) + 2.0) * 0.25;
            scale = 0.2 + scale * (halo.count / 50);
            angle = Math.PI * 2 * (timeTicks % (5000 + 500 * i)) / (5000 + (500 * i));
            
            const mat = HALO_UNIFORMS.matrix;
            twgl.m4.identity(mat);
            twgl.m4.ortho(0, nodeGL.canvas.clientWidth, nodeGL.canvas.clientHeight, 0, -1, 1, mat);
            twgl.m4.translate(mat, [(nodeGL.canvas.clientWidth) / 2, (nodeGL.canvas.clientHeight) / 2, 0], mat);
            twgl.m4.scale(mat, [512, 512, 1], mat);
            twgl.m4.scale(mat, [scale, scale, 1], mat);
            twgl.m4.rotateZ(mat, angle, mat);
    
            const tmat = HALO_UNIFORMS.textureMatrix;
            twgl.m4.identity(tmat);
            twgl.m4.scale(tmat, [0.03125, 0.125, 1], tmat);
            twgl.m4.translate(tmat, [frame + 0.5, 0.5, 0], tmat);
    
            twgl.setBuffersAndAttributes(nodeGL, nodeProgramInfo, halo.bufferInfo);
            let useAlpha = alpha;
            if (ASPECT_COLORS[halo.aspect].blend === nodeGL.ONE_MINUS_SRC_ALPHA) {
                useAlpha *= 1.5;
            }
            HALO_UNIFORMS.aspectColor = getColor(halo.aspect, useAlpha);
            twgl.setUniforms(nodeProgramInfo, HALO_UNIFORMS);
            nodeGL.blendFunc(nodeGL.SRC_ALPHA, ASPECT_COLORS[halo.aspect].blend);
            twgl.drawBufferInfo(nodeGL, halo.bufferInfo);
        }
    
        // Draw core
        scale = 0.1 + (getVisTotal() / ASPECT_HALOS.length) / 150.0;
        switch (CORE_TYPE) {
            case 0: //Normal
                nodeGL.blendFunc(nodeGL.SRC_ALPHA, nodeGL.ONE);
                break;
            case 1: //Sinister
                nodeGL.blendFunc(nodeGL.SRC_ALPHA, nodeGL.ONE_MINUS_SRC_ALPHA);
                break;
            case 2: //Hungry
                nodeGL.blendFunc(nodeGL.SRC_ALPHA, nodeGL.ONE);
                scale *= 0.75;
                break;
            case 3: //Pure
                nodeGL.blendFunc(nodeGL.SRC_ALPHA, nodeGL.ONE);
                break;
            case 4: //Tainted
                nodeGL.blendFunc(nodeGL.SRC_ALPHA, nodeGL.ONE_MINUS_SRC_ALPHA);
                break;
            case 5: //Unstable
                nodeGL.blendFunc(nodeGL.SRC_ALPHA, nodeGL.ONE);
                break;

        }
        const mat = CORE_UNIFORMS.matrix;
        twgl.m4.identity(mat);
        twgl.m4.ortho(0, nodeGL.canvas.clientWidth, nodeGL.canvas.clientHeight, 0, -1, 1, mat);
        twgl.m4.translate(mat, [(nodeGL.canvas.clientWidth) / 2, (nodeGL.canvas.clientHeight) / 2, 0], mat);
        twgl.m4.scale(mat, [512, 512, 1], mat);
        twgl.m4.scale(mat, [scale, scale, 1], mat);
        twgl.m4.rotateZ(mat, angle, mat);
        const tmat = CORE_UNIFORMS.textureMatrix;
        twgl.m4.identity(tmat);
        twgl.m4.scale(tmat, [0.03125, 0.125, 1], tmat);
        twgl.m4.translate(tmat, [frame + 0.5, CORE_TYPE + 1.5, 0], tmat);
        twgl.setBuffersAndAttributes(nodeGL, nodeProgramInfo, CORE_BUFFER_INFO);
        CORE_UNIFORMS.aspectColor = [1, 1, 1, alpha];
        twgl.setUniforms(nodeProgramInfo, CORE_UNIFORMS);
        twgl.drawBufferInfo(nodeGL, CORE_BUFFER_INFO);
    
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
    document.getElementById("node-type").addEventListener("change", function() {
        CORE_TYPE = Number(this.value);
    });
    document.getElementById("sel-brightness-modifier").addEventListener("change", function() {
        BRIGHTNESS = Number(this.value);
    });

    document.getElementById("distance-to-node").addEventListener('input', function() {
        document.getElementById("spn-distance-counter").textContent = this.value;
    });

    document.getElementById('cbx-enable-visibility-boost').addEventListener('change', function() {
        IS_VISIBILITY_MODE_ON = this.checked;
    });

    document.getElementById('open-controls').addEventListener('click', function () {
        this.style.display = 'none';
        document.getElementById('controls').style.width = '21em';
    });

    document.getElementById('close-controls').addEventListener('click', () => {
        document.getElementById('controls').style.width = '0';
        document.getElementById('open-controls').style.display = 'flex';
    });

    document.getElementById('div-about-btn').addEventListener('click', function () {
        document.getElementById('div-about-modal-bg').style.display = 'block';
    });

    document.getElementById('div-about-modal-bg').addEventListener('click', function (e) {
        if (e.target.id !== 'div-about-modal-bg') {
            return;
        }
        document.getElementById('div-about-modal-bg').style.display = 'none';
    });

    addAspect();
});
