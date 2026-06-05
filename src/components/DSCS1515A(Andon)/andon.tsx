import React from 'react';

export default function Andon() {
	return (
		<div className="p-6 w-full">
			<h2 className="text-2xl font-bold mb-4">Andon</h2>

			<div className="grid grid-cols-3 gap-4">
				<div className="p-6 bg-zinc-900/60 rounded-lg text-white">Performance EFI<br/><span className="text-3xl font-extrabold">0%</span></div>
				<div className="p-6 bg-zinc-900/60 rounded-lg text-white">Line EFI<br/><span className="text-3xl font-extrabold">0%</span></div>
				<div className="p-6 bg-zinc-900/60 rounded-lg text-white">Hourly Target / Achieve<br/><span className="text-xl font-bold">0 / 0</span></div>
			</div>
		</div>
	);
}
