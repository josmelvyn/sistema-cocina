<?php
namespace App\Services;
use App\Models\NfcSequence;
use Illuminate\Support\Facades\DB;

class NfcService {
    public static function generateNext($type) {
        return DB::transaction(function () use ($type) {
            $sequence = NfcSequence::where('type', $type)
                ->where('active', true)
                ->lockForUpdate()
                ->first();

            if (!$sequence || $sequence->current >= $sequence->final) {
                throw new \Exception("Secuencia NCF agotada o vencida.");
            }

            $sequence->current += 1;
            $sequence->save();

            // Formatea el número (ej: B0100000005)
            return $sequence->prefix . str_pad($sequence->current, 8, '0', STR_PAD_LEFT);
        });
    }
}