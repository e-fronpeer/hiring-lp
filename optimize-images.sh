#!/bin/bash

# 画像を最適化する関数
optimize_image() {
    local input_file="$1"
    local output_file="${input_file%.*}_optimized.${input_file##*.}"
    
    # JPEGの場合
    if [[ $input_file == *.jpg ]] || [[ $input_file == *.jpeg ]]; then
        convert "$input_file" -strip -quality 85 "$output_file"
    # PNGの場合
    elif [[ $input_file == *.png ]]; then
        convert "$input_file" -strip -quality 85 "$output_file"
    fi
    
    # 最適化後のファイルサイズを確認
    original_size=$(stat -f%z "$input_file")
    optimized_size=$(stat -f%z "$output_file")
    
    echo "Original: $original_size bytes"
    echo "Optimized: $optimized_size bytes"
    
    # 最適化後のファイルが小さければ置き換え
    if [ $optimized_size -lt $original_size ]; then
        mv "$output_file" "$input_file"
        echo "Replaced with optimized version"
    else
        rm "$output_file"
        echo "Kept original version"
    fi
}

# imagesディレクトリ内の画像を最適化
for img in images/*.{jpg,jpeg,png}; do
    if [ -f "$img" ]; then
        echo "Optimizing $img..."
        optimize_image "$img"
    fi
done 