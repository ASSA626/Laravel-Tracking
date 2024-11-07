<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('duty_clocks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->unsignedBigInteger('duty_id');
            $table->foreign('duty_id')->references('id')->on('duties')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('start_time');
            $table->string('daily_time')->nullable();
            $table->string('left_time')->nullable();
            $table->string('status')->default('confirming');
            $table->date('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('duty_clocks');
    }
};
