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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('fullname')->unique();
            $table->string('username')->unique();
            $table->string('mobile')->unique();
            $table->string('national_code')->unique();
            $table->string('image')->nullable();
            $table->string('father_name');
            $table->string('address');
            $table->string('zip')->unique()->nullable();
            $table->string('personally_number')->unique()->nullable();
            $table->string('bimeh_number')->unique()->nullable();
            $table->string('home_phone')->unique()->nullable();
            $table->string('mobile_friend')->unique();
            $table->boolean('user_activity')->default(true);
            $table->boolean('days_function')->default(false);
            $table->boolean('bimeh')->default(false);
            $table->string('password');
            $table->string('role')->default('user');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('mobile')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
