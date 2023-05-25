class Vector {
    constructor(elements) {
        this.elements = elements;
    }

    e(i) {
        return this.elements[i - 1];
    }
}

class Matrix {
    constructor(elements) {
        this.elements = elements;
    }

    static I(n) {
        let elements = [];
        for (let i = 0; i < n; i++) {
            let row = [];
            for (let j = 0; j < n; j++) {
                row.push(i === j ? 1 : 0);
            }
            elements.push(row);
        }
        return new Matrix(elements);
    }

    static RotationX(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const elements = [
            [1, 0, 0, 0],
            [0, cos, -sin, 0],
            [0, sin, cos, 0],
            [0, 0, 0, 1]
        ];
        return new Matrix(elements);
    }

    static RotationY(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const elements = [
            [cos, 0, sin, 0],
            [0, 1, 0, 0],
            [-sin, 0, cos, 0],
            [0, 0, 0, 1]
        ];
        return new Matrix(elements);
    }

    static RotationZ(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const elements = [
            [cos, -sin, 0, 0],
            [sin, cos, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        return new Matrix(elements);
    }

    static Translation(v) {
        let elements = [
            [1, 0, 0, v.e(1)],
            [0, 1, 0, v.e(2)],
            [0, 0, 1, v.e(3)],
            [0, 0, 0, 1]
        ];
        return new Matrix(elements);
    }

    static Perspective(fovy, aspect, near, far) {
        const f = 1.0 / Math.tan(fovy / 2);
        const rangeInv = 1 / (near - far);
    
        const elements = [
            [f / aspect, 0, 0, 0],
            [0, f, 0, 0],
            [0, 0, (near + far) * rangeInv, -1],
            [0, 0, near * far * rangeInv * 2, 0]
        ];
    
        return new Matrix(elements);
    }

    static Scale(v) {
        let elements = [
            [v.e(1), 0, 0, 0],
            [0, v.e(2), 0, 0],
            [0, 0, v.e(3), 0],
            [0, 0, 0, 1]
        ];
        return new Matrix(elements);
    }

    x(m) {
        let e = this.elements;
        let f = m.elements;
        if (e[0].length !== f.length) {
            throw new Error("Incompatible matrices");
        }
        let result = [];
        for (let i = 0; i < e.length; i++) {
            let row = [];
            for (let j = 0; j < f[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < e[0].length; k++) {
                    sum += e[i][k] * f[k][j];
                }
                row.push(sum);
            }
            result.push(row);
        }
        return new Matrix(result);
    }

    flatten() {
        let result = [];
        for(let i = 0; i < this.elements.length; i++) {
            result = result.concat(this.elements[i]);
        }
        return result;
    }

    transpose() {
        let e = this.elements;
        let result = [];
        for (let i = 0; i < e[0].length; i++) {
            let row = [];
            for (let j = 0; j < e.length; j++) {
                row.push(e[j][i]);
            }
            result.push(row);
        }
        return new Matrix(result);
    }

    determinant() {
        let e = this.elements;
    
        if (e.length !== e[0].length) {
            throw new Error("Matrix is not square");
        }
    
        if (e.length === 2) {
            return e[0][0] * e[1][1] - e[0][1] * e[1][0];
        }
    
        let det = 0;
        for (let i = 0; i < e.length; i++) {
            const cofactor = this.cofactor(0, i);
            det += e[0][i] * cofactor;
        }
    
        return det;
    }
    
    cofactor(row, col) {
        let e = this.elements;
    
        const subMatrix = [];
        for (let i = 0; i < e.length; i++) {
            if (i === row) continue;
            const subRow = [];
            for (let j = 0; j < e[0].length; j++) {
                if (j === col) continue;
                subRow.push(e[i][j]);
            }
            subMatrix.push(subRow);
        }
    
        const subMatrixObj = new Matrix(subMatrix);
        const cofactor = subMatrixObj.determinant();
    
        return ((row + col) % 2 === 0) ? cofactor : -cofactor;
    }
    
    inverse() {
        let e = this.elements;
    
        if (e.length !== e[0].length) {
            throw new Error("Matrix is not square");
        }
    
        const det = this.determinant();
    
        if (det === 0) {
            throw new Error("Matrix is not invertible");
        }
    
        const adjugate = new Matrix([]);
    
        for (let i = 0; i < e.length; i++) {
            const row = [];
            for (let j = 0; j < e[0].length; j++) {
                row.push(this.cofactor(i, j));
            }
            adjugate.elements.push(row);
        }
    
        const adjugateTransposed = adjugate.transpose();
        const inverse = adjugateTransposed.scalarMultiply(1 / det);
    
        return inverse;
    }
    
    scalarMultiply(scalar) {
        let e = this.elements;
    
        const result = [];
        for (let i = 0; i < e.length; i++) {
            const row = [];
            for (let j = 0; j < e[0].length; j++) {
                row.push(e[i][j] * scalar);
            }
            result.push(row);
        }
    
        return new Matrix(result);
    }
}
