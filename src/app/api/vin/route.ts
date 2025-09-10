import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const vin = (url.searchParams.get('vin') || '').toUpperCase().trim();

  if (!vin || !/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    return NextResponse.json({ error: 'Invalid VIN' }, { status: 400 });
  }

  try {
    const r = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`, {
      next: { revalidate: 86400 }
    });
    if (!r.ok) throw new Error(`NHTSA API error: ${r.status}`);
    const data = await r.json();
    const res = data?.Results?.[0] ?? {};

    return NextResponse.json({
      vin,
      make: res.Make || null,
      model: res.Model || null,
      year: res.ModelYear ? Number(res.ModelYear) : null,
      trim: res.Trim || null,
      engine: res.EngineModel || res.EngineCylinders || res.EngineConfiguration || null,
      transmission: res.TransmissionStyle || res.TransmissionSpeeds || null,
      bodyStyle: res.BodyClass || null,
      fuel: res.FuelTypePrimary || null,
      manufacturer: res.ManufacturerName || null,
      plantCountry: res.PlantCountry || null,
      vehicleType: res.VehicleType || null
    });
  } catch (e: any) {
    console.error('VIN decode error:', e);
    return NextResponse.json({ error: 'VIN decode failed' }, { status: 502 });
  }
}
