/**
 * Pure math: given the two defining points A and B, compute every derived
 * point shown in the scene.
 *
 * Naming convention (kept from the original implementation):
 *   Af/Ah/Ap, Bf/Bh/Bp — orthogonal projections of A and B onto the
 *     frontal (x=0), horizontal (y=0) and profile (z=0) planes;
 *   Ax/Ay/Az, Bx/By/Bz — projections onto the coordinate axes;
 *   F/H/P              — traces: points where the line AB pierces the
 *     frontal, horizontal and profile planes;
 *   pF/hF, pH/fH, hP/fP — projections of the traces onto the axes.
 */
export function computeDerivedPoints(A, B) {
	const vector = {
		x: B.x - A.x,
		y: B.y - A.y,
		z: B.z - A.z,
	};

	// Line parameter values at which the line crosses each coordinate plane.
	const tX = -A.x / vector.x;
	const tY = -A.y / vector.y;
	const tZ = -A.z / vector.z;

	const F = { x: 0, y: A.y + vector.y * tX, z: A.z + vector.z * tX };
	const H = { x: A.x + vector.x * tY, y: 0, z: A.z + vector.z * tY };
	const P = { x: A.x + vector.x * tZ, y: A.y + vector.y * tZ, z: 0 };

	return {
		Af: { x: 0, y: A.y, z: A.z },
		Ah: { x: A.x, y: 0, z: A.z },
		Ap: { x: A.x, y: A.y, z: 0 },

		Bf: { x: 0, y: B.y, z: B.z },
		Bh: { x: B.x, y: 0, z: B.z },
		Bp: { x: B.x, y: B.y, z: 0 },

		Ax: { x: A.x, y: 0, z: 0 },
		Ay: { x: 0, y: A.y, z: 0 },
		Az: { x: 0, y: 0, z: A.z },
		Bx: { x: B.x, y: 0, z: 0 },
		By: { x: 0, y: B.y, z: 0 },
		Bz: { x: 0, y: 0, z: B.z },

		F: F,
		H: H,
		P: P,

		pF: { x: 0, y: F.y, z: 0 },
		hF: { x: 0, y: 0, z: F.z },
		pH: { x: H.x, y: 0, z: 0 },
		fH: { x: 0, y: 0, z: H.z },
		hP: { x: P.x, y: 0, z: 0 },
		fP: { x: 0, y: P.y, z: 0 },
	};
}
