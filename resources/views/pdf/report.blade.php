<!DOCTYPE html>
<html lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> فرم گزارشگیری ماهانه: {{ $user->fullname }} </title>

    @vite('resources/css/app.css')
</head>
<body class="antialiased flex flex-col h-screen text-sm text-black tracking-tight">
    <div class="py-3 px-8">
        <header class="w-full flex justify-between bg-gray-200 rounded-sm px-4 py-0.5 border border-dashed border-gray-600">
            <div class="flex items-center gap-3">
                <img src="{{ $user->image }}" alt="{{ $user->fullname }}" class="w-14 h-14 rounded-full">
                <div class="flex flex-col gap-1">
                    <p class="text-[11px]">نام و نام خانوادگی: {{ $user->fullname }}</p>
                    <p class="text-[11px]">کدملی: {{ $user->national_code }}</p>
                </div>
            </div>

            <div class="flex flex-col justify-center gap-1">
                <p class="text-[11px]">گزارش ایجاد شده در پنجشنبه، 12 مهر ماه 1403 از تاریخ 1403/07/01 تا 1403/07/30</p>
                <p class="text-[11px] text-end">مهندسان مشاور زمین ترسیم خاورمیانه</p>
            </div>
        </header>
    </div>

    <div class="w-full mx-auto px-8 mb-4">
        <table class="border-collapse w-full text-[11px]">
            <thead>
                <tr class="text-center">
                    <th class="font-normal border border-black">ردیف</th>
                    <th class="font-normal border border-black">تاریخ</th>
                    <th class="font-normal border border-black">از ساعت</th>
                    <th class="font-normal border border-black">تا ساعت</th>
                    <th class="font-normal border border-black">از ساعت</th>
                    <th class="font-normal border border-black">تا ساعت</th>
                    <th class="font-normal border border-black">میزان کارکرد</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($reports as $report)
                    <tr class="text-center">
                        <td class="text-[10px] font-bold border border-black">{{ $loop->iteration }}</td>
                        <td class="text-[10px] font-bold border border-black">{{ $report['date'] }}</td>
                        <td class="text-[10px] font-bold border border-black">{{ $report['start_time_clocks'] }}</td>
                        <td class="text-[10px] font-bold border border-black">{{ $report['end_time_clocks'] }}</td>
                        <td class="text-[10px] font-bold border border-black">{{ $report['start_time_work_at_home'] }}</td>
                        <td class="text-[10px] font-bold border border-black">{{ $report['end_time_work_at_home'] }}</td>
                        <td class="text-[10px] font-bold border border-black">{{ $report['total_time'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="w-full mx-auto px-8 mb-4">
        <table class="border-collapse w-full text-[11px]">
            <thead>
                <tr class="text-center">
                    <th class="font-normal border border-black">ردیف</th>
                    <th class="font-normal border border-black">نام پروژه</th>
                    <th class="font-normal border border-black">ساعت کارکرد</th>
                </tr>
            </thead>

            <tbody>
                @foreach($works as $work)
                    <tr class="text-center">
                        <td class="text-[10px] font-bold border border-black">{{ $loop->iteration }}</td>
                        <td class="text-[10px] font-bold border border-black">{{ $work['project'] }}</td>
                        <td class="text-[10px] font-bold border border-black">{{ $work['time'] }} ساعت </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="w-full px-8 mb-10 flex items-center gap-4">
        <div class="mx-auto w-full">
            <table class="border-collapse w-full text-[11px]">
                <thead>
                <tr class="text-center">
                    <th class="font-normal border border-black">جمع کل ساعات</th>
                    <th class="font-normal border border-black">جمع روز کاری</th>
                </tr>
                </thead>

                <tbody>
                    <tr class="text-center">
                        <td class="text-[10px] font-bold border border-black">{{ $total_time }} ساعت </td>
                        <td class="text-[10px] font-bold border border-black">{{ $total_day }} روز </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mx-auto w-full">
            <table class="border-collapse w-full text-[11px]">
                <thead>
                    <tr class="text-center">
                        <th class="font-normal border border-black">مرخصی های استفاده شده در ماه</th>
                        <th class="font-normal border border-black">کل مرخصی های موجود</th>
                    </tr>
                </thead>

                <tbody>
                    <tr class="text-center">
                        <td class="text-[10px] font-bold border border-black">8 روز مرخصی استفاده شده</td>
                        <td class="text-[10px] font-bold border border-black">22 مرخصی مانده</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="flex items-center justify-between px-8">
        <div class="w-full h-full text-right pl-6 pr-2">
            <p class="text-12 font-normal">امضای {{ $user->fullname }}:</p>
        </div>

        <div class="w-full h-full text-right pr-2">
            <p class="text-12 font-normal">مدیر پروژه:</p>
        </div>

        <div class="w-full h-full text-right pr-2">
            <p class="text-12 font-normal">رئیس هیئت مدیره:</p>
        </div>

        <div class="w-full h-full text-right pr-2">
            <p class="text-12 font-normal">مدیرعامل:</p>
        </div>
    </div>
</body>
</html>
