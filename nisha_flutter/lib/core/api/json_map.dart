Map<String, dynamic> asJsonMap(Object? data) {
  if (data is Map<String, dynamic>) {
    return data;
  }
  if (data is Map) {
    return data.cast<String, dynamic>();
  }
  return <String, dynamic>{};
}

List<Map<String, dynamic>> asJsonList(Object? data) {
  if (data is! List) {
    return const <Map<String, dynamic>>[];
  }
  return data
      .whereType<Map>()
      .map((item) => item.cast<String, dynamic>())
      .toList();
}

String? asString(Object? value) {
  if (value == null) {
    return null;
  }
  if (value is String) {
    return value;
  }
  return value.toString();
}

String asStringOr(Object? value, [String fallback = '']) {
  return asString(value) ?? fallback;
}

int asInt(Object? value, [int fallback = 0]) {
  if (value is int) {
    return value;
  }
  if (value is num) {
    return value.toInt();
  }
  if (value is String) {
    return int.tryParse(value) ?? fallback;
  }
  return fallback;
}

double asDouble(Object? value, [double fallback = 0]) {
  if (value is double) {
    return value;
  }
  if (value is num) {
    return value.toDouble();
  }
  if (value is String) {
    return double.tryParse(value) ?? fallback;
  }
  return fallback;
}

bool asBool(Object? value, [bool fallback = false]) {
  if (value is bool) {
    return value;
  }
  if (value is String) {
    return value.toLowerCase() == 'true' || value == '1';
  }
  if (value is num) {
    return value != 0;
  }
  return fallback;
}
