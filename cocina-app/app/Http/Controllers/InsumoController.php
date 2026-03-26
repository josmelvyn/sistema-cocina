<?php

namespace App\Http\Controllers;

use App\Models\Insumo;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // <--- Importante para la seguridad de los datos
use Inertia\Inertia;

class InsumoController extends Controller
{
    public function index()
    {
        return Inertia::render('Insumos/Index', [
            'insumos' => Insumo::orderBy('nombre', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'unidad_medida' => 'required|string',
            'stock_actual' => 'required|numeric|min:0',
        ]);

        // Usamos DB::transaction para que la operación sea "todo o nada"
        return DB::transaction(function () use ($validated) {
            
            // 1. Creamos el registro del insumo
            $insumo = Insumo::create($validated);

            // 2. Registramos el movimiento de entrada inicial
            MovimientoInventario::create([
                'insumo_id' => $insumo->id,
                'tipo' => 'entrada',
                'cantidad' => $validated['stock_actual'],
                'descripcion' => 'Inventario inicial / Apertura de stock'
            ]);

            return redirect()->back()->with('message', 'Insumo y stock inicial registrados.');
        });
    }

    /**
     * Permite aumentar el stock de un insumo existente (Nueva Compra)
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'cantidad' => 'required|numeric|min:0.01',
            'descripcion' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($request, $id) {
            $insumo = Insumo::findOrFail($id);
            
            // Sumamos al stock actual
            $insumo->increment('stock_actual', $request->cantidad);

            // Registramos la entrada
            MovimientoInventario::create([
                'insumo_id' => $insumo->id,
                'tipo' => 'entrada',
                'cantidad' => $request->cantidad,
                'descripcion' => $request->descripcion ?? 'Ajuste de inventario / Compra'
            ]);

            return redirect()->back();
        });
    }

    public function show($id)
    {
        return redirect()->route('insumos.index');
    }
}